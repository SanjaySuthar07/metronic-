'use client'

import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, LoaderCircleIcon } from 'lucide-react'
import { useDispatch } from 'react-redux'

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

const type = [
  { id: 'admin', name: 'Admin' },
  { id: 'agent', name: 'Agent' },
]

const InviteAddDialog = ({
  open,
  closeDialog,
  isEdit,
  editData,
  onSuccess
}: any) => {

  const dispatch = useDispatch()

  const [passwordVisible, setPasswordVisible] = useState(false)
  const [isAgencyDropDownOpen, setIsAgencyDropDownOpen] = useState(false)
  const [agency, setAgency] = useState<any[]>([])
  const [isSubmit, setIsSubmit] = useState(false)

  const form = useForm<InviteAddSchemaType>({
    resolver: zodResolver(InviteAddSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      user_type: '',
      tenant_id: '',
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        user_type: '',
        tenant_id: '',
      })
      setIsAgencyDropDownOpen(false)
    }
  }, [open])

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
      name: values.name,
      email: values.email,
      password: values.password,
      user_type: values.user_type,
      tenant_id: values.tenant_id,
    }

    const res: any = await dispatch(createInviteUser(payload))

    if (createInviteUser.fulfilled.match(res)) {

      toast.success("User invited successfully")

      onSuccess?.()   // ⭐ LIST REFRESH

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
                                {item.name}
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

              {isAgencyDropDownOpen && (

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

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (

                  <FormItem>

                    <FormLabel>
                      Name <span className="text-red-500">*</span>
                    </FormLabel>

                    <FormControl>
                      <Input
                        placeholder="Enter Your Name"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />

                  </FormItem>

                )}
              />

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

              <FormField
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
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (

                  <FormItem>

                    <FormLabel>
                      Confirm Password
                      <span className="text-red-500">*</span>
                    </FormLabel>

                    <FormControl>

                      <Input
                        type={passwordVisible ? 'text' : 'password'}
                        placeholder="Confirm Password"
                        {...field}
                      />

                    </FormControl>

                    <FormMessage />

                  </FormItem>

                )}
              />

            </DialogBody>

            <DialogFooter>

              <Button
                type="button"
                variant="outline"
                onClick={closeDialog}
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