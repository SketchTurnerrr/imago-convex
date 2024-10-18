'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { useToast } from '@/components/ui/use-toast';
import { redirect } from 'next/navigation';
import { useState } from 'react';

const formSchema = z.object({
  email: z.string().email({ message: 'Це не схоже на адресу' }).min(2, {
    message: 'Username must be at least 2 characters.',
  }),
});

export default function Page() {
  const [disableOtpBtn, setDisableOtpBtn] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  async function signInWithGoogle() {}

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setDisableOtpBtn(true);

      const timeout = setInterval(() => {
        return setSecondsLeft((prev) => prev - 1);
      }, 1000);

      setTimeout(() => {
        setDisableOtpBtn(false);
        setSecondsLeft(60);

        clearInterval(timeout);
      }, secondsLeft * 1000);
    } catch (error) {
      console.log('error :', error);
    }

    // toast({
    //   title: 'Перевірте, будь ласка свою пошту',
    //   description: 'У листі ви знайдете посилання для входу',
    //   duration: 10000,
    //   variant: 'success',
    // });
  }

  return (
    <div className="grid h-[100svh] w-full place-items-center">
      <div className="w-full md:max-w-sm">
        <Image
          className="block mx-auto mb-16 dark:hidden"
          src={'/logo.svg'}
          width={250}
          height={150}
          alt="imago logo"
        />
        <Image
          className="hidden mx-auto mb-16 dark:block"
          src={'/logo-dark.svg'}
          width={250}
          height={150}
          alt="imago logo"
        />

        {/* <Logo /> */}
        <div className="p-5 rounded-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Email</FormLabel> */}
                    <FormControl>
                      <Input
                        className="py-6"
                        placeholder="Електронна адреса"
                        type="email"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="p-2 border border-gray-400 rounded-sm">
                <p className="text-sm text-gray-400">
                  ✨ Непотрібно ніяких паролів, ми відправимо вам на пошту
                  посилання для входу.
                </p>
              </div>
              <Button
                disabled={disableOtpBtn}
                className="w-full p-6 text-lg font-bold bg-purple-400 hover:bg-purple-500"
                type="submit"
              >
                Отримати посилання {secondsLeft < 60 && `(${secondsLeft})`}
              </Button>
              <p style={{ marginBlock: '1rem' }} className="text-center">
                або
              </p>
            </form>
          </Form>
          <Button
            variant="outline"
            className="w-full p-6 text-lg font-bold"
            type="submit"
            onClick={signInWithGoogle}
          >
            <Image
              src="/google-logo.svg"
              alt="Google Logo"
              className="mr-2 dark:invert"
              width={24}
              height={24}
              priority
            />
            Увійти з Google
          </Button>
        </div>
      </div>
    </div>
  );
}
