'use client';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { RiCheckboxCircleFill } from '@remixicon/react';
import { Eye, EyeOff, LoaderCircleIcon } from 'lucide-react';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { InviteAddSchema, InviteAddSchemaType } from '../forms/invite-add-schema';
import { useDispatch } from 'react-redux';
import { fetchAgency } from '@/store/thunk/invite.thunk';
const type = [
  { id: "1", name: 'Admin' },
  { id: "2", name: 'Agent' },
];
const InviteAddDialog = ({ open, closeDialog, isEdit, editData, onSave, }: any) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isAgencyDropDownOpen, setIsAgencyDropDownOpen] = useState(false)
  const [agency, setAgency] = useState([])
  const dispatch = useDispatch()
  const form = useForm<InviteAddSchemaType>({
    resolver: zodResolver(InviteAddSchema),
    defaultValues: {
      typeID: "",
      agencyID: "",
      name: '',
      email: '',
      password: '',
      confirmPassword: "",
    },
  });
  useEffect(() => {
    if (!open) return;
    form.reset({
      typeID: "",
      agencyID: "",
      name: '',
      email: '',
      password: '',
      confirmPassword: "",
    });
  }, [open]);
  useEffect(() => {
    const getAgency = async () => {
      const agency = await dispatch(fetchAgency())
      setAgency(agency?.payload?.agency)
    }
    getAgency()
  }, [])
  const handleSubmit = async (values: InviteAddSchemaType) => {
    console.log(values)
  };
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) closeDialog();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Invite
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <DialogBody className="pt-2.5 space-y-6">
              <FormField
                control={form.control}
                name="typeID"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type<span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                          if (Number(value) == 2) {
                            setIsAgencyDropDownOpen(true)
                          } else {
                            form.setValue("agencyID", "")
                            setIsAgencyDropDownOpen(false)
                          }
                        }}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {type.map((type) => (
                              <SelectItem
                                key={type.id}
                                value={type.id}
                              >
                                {type.name}
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
              {isAgencyDropDownOpen ?
                < FormField
                  control={form.control}
                  name="agencyID"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agency<span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Agency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {agency.map((agency) => (
                                <SelectItem
                                  key={agency.id}
                                  value={agency.id}
                                >
                                  {agency.agency_name}
                                </SelectItem>

                              ))}

                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> : ""
              }
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name<span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Your Name" {...field} />
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
                    <FormLabel>Email<span className="text-red-500">*</span></FormLabel>
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
                          autoComplete="current-password"
                          className="pr-10"
                          {...field}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                        className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                      >
                        {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
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
                      Confirm Password <span className="text-red-500">*</span>
                    </FormLabel>

                    <div className="relative">

                      <FormControl>
                        <Input
                          type={passwordVisible ? 'text' : 'password'}
                          placeholder="Confirm Your  Password"
                          autoComplete="current-password"
                          className="pr-10"
                          {...field}
                        />
                      </FormControl>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                        className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                      >
                        {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                      </Button>

                    </div>
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
              <Button
                type="submit"
                disabled={isProcessing}
              >
                {isProcessing && (
                  <LoaderCircleIcon className="animate-spin mr-2" />
                )}
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteAddDialog;