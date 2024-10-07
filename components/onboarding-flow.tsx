'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { z } from 'zod';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from './ui/form';
import { Toggle } from './ui/toggle';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { locations } from '@/lib/constants';
import { PromptManager } from './PromptManager';
import { useAuth } from '@clerk/clerk-react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';

type Prompt = Doc<'prompts'>;

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Ім`я має бути не менше 2 символів',
  }),
  dateOfBirth: z.date().min(new Date(1974, 0, 1), {
    message: 'Ви повинні бути від 1974 року',
  }),
  denomination: z.enum([
    'Католізм',
    "Православ'я",
    'Євангелізм',
    'Баптизм',
    "П'ятидесятництво",
    'Неконфесійна',
    'Інше',
  ]),
  gender: z.enum(['male', 'female']),
  location: z.string(),
  custom_location: z.string(),
  prompts: z.any(),
});

const steps = [
  'Welcome',
  'Name',
  'Date of Birth',
  'Gender',
  'Denomination',
  'Location',
  'Prompts',
  'Finish',
];

export function OnboardingFlow() {
  const [open, setOpen] = useState(false);

  const [currentStep, setCurrentStep] = useState(6);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      dateOfBirth: undefined,
      gender: 'male',
      denomination: 'Інше',
      location: 'Київ',
    },
  });

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep />;
      case 1:
        return <NameStep />;
      case 2:
        return <DateOfBirthStep />;
      case 3:
        return <GenderStep />;
      case 4:
        return <DenominationStep />;
      case 5:
        return <LocationStep />;
      case 6:
        return <PromptStep />;
      case 7:
        return <FinishStep />;
      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return (
          form.getFieldState('name').isDirty &&
          !form.getFieldState('name').invalid
        );
      case 2:
        return !!form.getValues('dateOfBirth');
      case 3:
        return !!form.getValues('gender');
      case 4:
        return !!form.getValues('denomination');
      case 5:
        return !!form.getValues('location');
      case 6:
        // The PromptManager now handles its own validation
        return true;
      default:
        return true;
    }
  };

  console.log('isStepValid :', isStepValid());
  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col h-[100svh] md:w-[500px] p-6 mx-auto  rounded-lg max-w-md"
        >
          <div className="flex items-center gap-4 mb-6">
            {currentStep > 1 && (
              <Button type="button" onClick={prevStep} variant="ghost">
                <ChevronLeft className="w-4 h-4 " />
              </Button>
            )}
            <span className="block text-sm text-gray-500 whitespace-nowrap">
              {currentStep} з 6
            </span>

            <div className="w-full h-2 bg-gray-200 rounded-full ">
              <div
                className="h-2 transition-all duration-300 ease-in-out bg-blue-600 rounded-full"
                style={{ width: `${(currentStep / 6) * 100}%` }}
              ></div>
            </div>
          </div>
          {renderStep()}
          {currentStep !== 6 && (
            <div className="flex justify-between mt-auto">
              {currentStep < 6 ? (
                <Button
                  disabled={!isStepValid()}
                  type="button"
                  onClick={nextStep}
                  className="ml-auto "
                >
                  Далі <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  disabled={!isStepValid()}
                  type="submit"
                  className="ml-auto"
                >
                  Підтвердити
                </Button>
              )}
            </div>
          )}
        </form>
      </Form>
    </FormProvider>
  );

  function WelcomeStep() {
    return <div>Welcome step content</div>;
  }

  function NameStep() {
    return (
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem className="self-center mt-20">
            <FormLabel className="text-4xl font-bold uppercase">
              Як вас звати?
            </FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ваше ім'я" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  function DateOfBirthStep() {
    return (
      <FormField
        control={form.control}
        name="dateOfBirth"
        render={({ field }) => (
          <FormItem className="self-center mt-20">
            <FormLabel>Дата народження</FormLabel>
            <FormControl>
              <Calendar
                mode="single"
                startMonth={new Date(1977, 1)}
                endMonth={new Date(2006, 12)}
                selected={field.value ?? undefined}
                onSelect={(date) => field.onChange(date)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  function GenderStep() {
    return (
      <FormField
        control={form.control}
        name="gender"
        render={({ field }) => (
          <FormItem className="self-center mt-20">
            <FormLabel className="block mb-5 text-4xl font-bold uppercase">
              Стать
            </FormLabel>
            <FormControl>
              <div className="flex flex-col gap-8">
                <div className="flex items-center gap-2">
                  <Toggle
                    className="bg-accent data-[state=on]:bg-purple-400 data-[state=on]:text-white"
                    pressed={field.value === 'male'}
                    onClick={() => field.onChange('male')}
                    id="male"
                  >
                    Чоловіча
                  </Toggle>
                  <Toggle
                    className="bg-accent data-[state=on]:bg-purple-400 data-[state=on]:text-white"
                    pressed={field.value === 'female'}
                    onClick={() => field.onChange('female')}
                    id="female"
                  >
                    Жіноча
                  </Toggle>
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  function DenominationStep() {
    return (
      <FormField
        control={form.control}
        name="denomination"
        render={({ field }) => (
          <FormItem className="self-center mt-20">
            <FormLabel className="block mb-5 text-4xl font-bold uppercase">
              Ваша конфесія?
            </FormLabel>
            <FormControl>
              <div className="flex flex-col gap-8">
                <div className="flex flex-wrap items-center gap-3">
                  <Toggle
                    className="bg-accent font-semibold data-[state=on]:bg-purple-400 data-[state=on]:text-white"
                    pressed={field.value === 'Католізм'}
                    onClick={() => field.onChange('Католізм')}
                  >
                    Католізм
                  </Toggle>

                  <Toggle
                    className="bg-accent font-semibold data-[state=on]:bg-purple-400 data-[state=on]:text-white"
                    onClick={() => field.onChange("Православ'я")}
                    pressed={field.value === "Православ'я"}
                    id="ortho"
                  >
                    Православ&apos;я
                  </Toggle>

                  <Toggle
                    className="bg-accent font-semibold data-[state=on]:bg-purple-400 data-[state=on]:text-white"
                    onClick={() => field.onChange('Баптизм')}
                    pressed={field.value === 'Баптизм'}
                    id="baptist"
                  >
                    Баптизм
                  </Toggle>

                  <Toggle
                    className="bg-accent font-semibold data-[state=on]:bg-purple-400 data-[state=on]:text-white"
                    onClick={() => field.onChange("П'ятидесятництво")}
                    pressed={field.value === "П'ятидесятництво"}
                    id="pentecostal"
                  >
                    П&apos;ятидесятництво
                  </Toggle>

                  <Toggle
                    className="bg-accent font-semibold data-[state=on]:bg-purple-400 data-[state=on]:text-white"
                    onClick={() => field.onChange('Неконфесійна')}
                    pressed={field.value === 'Неконфесійна'}
                    id="nondeno"
                  >
                    Неконфесійна
                  </Toggle>

                  <Toggle
                    className="bg-accent font-semibold data-[state=on]:bg-purple-400 data-[state=on]:text-white"
                    onClick={() => field.onChange('Інше')}
                    pressed={field.value === 'Інше'}
                    id="other"
                  >
                    Інше
                  </Toggle>
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  function LocationStep() {
    return (
      <>
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="mt-20 ">
              <FormLabel className="block mb-5 text-4xl font-bold uppercase">
                Звідки ви?
              </FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Місто" />
                  </SelectTrigger>
                  <SelectContent className="overflow-y-auto max-h-[20rem]">
                    <SelectGroup>
                      {locations.map((item) => (
                        <SelectItem
                          key={item.value}
                          value={item.value}
                          className="flex items-center gap-2"
                        >
                          <span>{item.label}</span>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="custom_location"
          render={({ field }) => (
            <FormItem className="mt-4 ">
              <FormLabel className="block mb-5 text-xl font-bold uppercase">
                Або введіть ваш місто
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="w-[180px]"
                  {...field}
                  placeholder="Біла Церква"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </>
    );
  }

  function PromptStep() {
    return <PromptManager onComplete={nextStep} />;
  }

  function FinishStep() {
    return <div>Finish step content</div>;
  }
}
