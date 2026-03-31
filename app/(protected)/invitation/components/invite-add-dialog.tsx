'use client'

import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, LoaderCircleIcon } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'

import { Button } from '@/components/ui/button'

import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { Input } from '@/components/ui/input'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { InviteAddSchema, InviteAddSchemaType } from '../forms/invite-add-schema'
import { createInviteUser, fetchAgency } from '@/store/thunk/invite.thunk'
import { toast } from 'sonner'
import { hasPermission } from '@/lib/permissions'


const InviteAddDialog = ({
  open,
  closeDialog,
  isEdit,
  editData,
  onSuccess
}: any) => {
  const { user } = useSelector((s: any) => s.auth)

  const type = useMemo(() => {
    if (!user) return [];
    if (user.user_type === "super_admin") {
      return [
        { id: 'admin', name: 'Admin' },
        { id: 'agency', name: 'Agency' },
        { id: 'agent', name: 'Agent' },
      ];
    }
    if (user.user_type === "admin") {
      const result = [];
      if (hasPermission(user, "agency-create")) {
        result.push({ id: 'agency', name: 'Agency' });
      }
      if (hasPermission(user, "agent-create")) {
        result.push({ id: 'agent', name: 'Agent' });
      }
      return result;
    }

    if (user.user_type === "agency") {
      return [{ id: 'agent', name: 'Agent' }];
    }
    return [];
  }, [user]);
  const dispatch = useDispatch()

  const [passwordVisible, setPasswordVisible] = useState(false)
  const [CpasswordVisible, setCPasswordVisible] = useState(false)
  const [isAgencyDropDownOpen, setIsAgencyDropDownOpen] = useState(false)
  const [agency, setAgency] = useState<any[]>([])
  const [isSubmit, setIsSubmit] = useState(false)

  const form = useForm<InviteAddSchemaType>({
    resolver: zodResolver(InviteAddSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      // password: '',
      // confirmPassword: '',
      user_type: '',
      tenant_id: '',
    },
  })

  // reset form
  useEffect(() => {
    if (open) {
      form.reset({
        first_name: '',
        last_name: '',
        email: '',
        // password: '',
        // confirmPassword: '',
        user_type: '',
        tenant_id: '',
      })
      setIsAgencyDropDownOpen(false)
    }
  }, [open])

  useEffect(() => {
    if (user?.user_type === 'agency') {
      form.setValue('tenant_id', user.tenant_id)
      form.setValue('user_type', 'agent')
    }
  }, [user, form])

  // fetch agency list
  useEffect(() => {
    const getAgency = async () => {
      const res: any = await dispatch(fetchAgency())
      setAgency(res?.payload?.agency || [])
    }

    getAgency()
  }, [dispatch])

  const handleSubmit = async (values: InviteAddSchemaType) => {

    setIsSubmit(true)

    const payload = {
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      // password: values.password,
      user_type: values.user_type,
      tenant_id: values.tenant_id,
    }

    const res: any = await dispatch(createInviteUser(payload))

    if (createInviteUser.fulfilled.match(res)) {

      toast.success("User invited successfully")

      onSuccess?.()

      closeDialog()

    } else {
      toast.error(res.payload)
    }

    setIsSubmit(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) closeDialog()
      }}
    >
      <DialogContent>

        <DialogHeader>
          <DialogTitle>Invite</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>

            <DialogBody className="pt-2.5 space-y-6">

              {user?.user_type !== "agency" && (
                <FormField
                  control={form.control}
                  name="user_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Type <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value || ''}
                          onValueChange={(value) => {
                            field.onChange(value)
                            if (value === 'agent') {
                              setIsAgencyDropDownOpen(true)
                            } else {
                              setIsAgencyDropDownOpen(false)
                              form.setValue('tenant_id', '')
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {type.map((item) => (
                                <SelectItem
                                  key={item.id}
                                  value={item.id}
                                >
                                  {item.name || "No Agency Found"}
                                </SelectItem>
                              ))}

                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* AGENCY DROPDOWN */}
              {isAgencyDropDownOpen && user?.user_type !== "agency" && (

                <FormField
                  control={form.control}
                  name="tenant_id"
                  render={({ field }) => (

                    <FormItem>

                      <FormLabel>
                        Agency <span className="text-red-500">*</span>
                      </FormLabel>

                      <FormControl>

                        <Select
                          value={field.value || ''}
                          onValueChange={field.onChange}
                        >

                          <SelectTrigger>
                            <SelectValue placeholder="Select Agency" />
                          </SelectTrigger>

                          <SelectContent>

                            <SelectGroup>

                              {agency.map((item: any) => (
                                <SelectItem
                                  key={item.id}
                                  value={item.id}
                                >
                                  {item.agency_name}
                                </SelectItem>
                              ))}

                            </SelectGroup>

                          </SelectContent>

                        </Select>

                      </FormControl>

                      <FormMessage />

                    </FormItem>

                  )}
                />

              )}

              {/* FRIST NAME */}
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (

                  <FormItem>

                    <FormLabel>
                      First Name <span className="text-red-500">*</span>
                    </FormLabel>

                    <FormControl>
                      <Input
                        placeholder="Enter Your First Name"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />

                  </FormItem>

                )}
              />

              {/* LAST NAME */}
              <FormField
                control={form.control}
                name="last_name"   
                render={({ field }) => (

                  <FormItem>

                    <FormLabel>
                      Last Name <span className="text-red-500">*</span>
                    </FormLabel>

                    <FormControl>
                      <Input
                        placeholder="Enter Your Last Name"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />

                  </FormItem>

                )}
              />

              {/* EMAIL */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (

                  <FormItem>

                    <FormLabel>
                      Email <span className="text-red-500">*</span>
                    </FormLabel>

                    <FormControl>

                      <Input
                        disabled={isEdit}
                        placeholder="Enter Your Email"
                        {...field}
                      />

                    </FormControl>

                    <FormMessage />

                  </FormItem>

                )}
              />

              {/* PASSWORD */}
              {/* <FormField
                control={form.control}
                name="password"
                render={({ field }) => (

                  <FormItem>

                    <FormLabel>
                      Password <span className="text-red-500">*</span>
                    </FormLabel>

                    <div className="relative">

                      <FormControl>

                        <Input
                          type={passwordVisible ? 'text' : 'password'}
                          placeholder="Enter your password"
                          className="pr-10"
                          {...field}
                        />

                      </FormControl>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setPasswordVisible(!passwordVisible)
                        }
                        className="absolute right-1 top-1/2 -translate-y-1/2"
                      >
                        {passwordVisible ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </Button>

                    </div>

                    <FormMessage />

                  </FormItem>

                )}
              /> */}

              {/* CONFIRM PASSWORD */}
              {/* <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (

                  <FormItem>

                    <FormLabel>
                      Confirm Password
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <div className="relative">
                      <FormControl>

                        <Input
                          type={CpasswordVisible ? 'text' : 'password'}
                          placeholder="Confirm Password"
                          {...field}
                        />

                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setCPasswordVisible(!CpasswordVisible)
                        }
                        className="absolute right-1 top-1/2 -translate-y-1/2"
                      >
                        {CpasswordVisible ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </Button>
                    </div>
                    <FormMessage />

                  </FormItem>

                )}
              /> */}

            </DialogBody>

            <DialogFooter>

              <Button
                type="button"
                variant="outline"
                onClick={closeDialog}
                disabled={isSubmit}
              >
                Cancel
              </Button>

              <Button type="submit">

                {isSubmit && (
                  <LoaderCircleIcon className="animate-spin mr-2" />
                )}

                Submit

              </Button>

            </DialogFooter>

          </form>
        </Form>

      </DialogContent>
    </Dialog>
  )
}

export default InviteAddDialog