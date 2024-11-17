"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Country, State, City } from "country-state-city";
import { getElevation } from "@/lib/utils";
import { useQueryState } from "nuqs";
import { useRouter } from "next/navigation";

const BirthDetailsSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  day: z
    .string()
    .regex(/^([1-9]|[12]\d|3[01])$/, { message: "Invalid day (1-31)" }),
  month: z
    .string()
    .regex(/^(0?[1-9]|1[0-2])$/, { message: "Invalid month (1-12)" }),
  year: z
    .string()
    .regex(/^\d{4}$/, { message: "Invalid year (4 digits required)" }),
  timeHour: z.string().regex(/^(0?[0-9]|1[0-9]|2[0-3])$/, {
    message: "Invalid hour (0-23)",
  }),
  timeMinute: z.string().regex(/^([0-5]?[0-9])$/, {
    message: "Invalid minute (0-59)",
  }),
  country: z.string().min(1, { message: "Country is required" }),
  state: z.string().min(1, { message: "State is required" }),
  city: z.string().min(1, { message: "City is required" }),
});

type FormValues = z.infer<typeof BirthDetailsSchema>;

interface SelectOption {
  value: string;
  label: string;
}

export const BirthChartForm = () => {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(BirthDetailsSchema),
  });

  const countries: SelectOption[] = useMemo(() => {
    const countryList: SelectOption[] = Country.getAllCountries().map(
      (country) => ({
        value: country.isoCode,
        label: country.name,
      })
    );
    return countryList;
  }, []);

  const states = useMemo<SelectOption[]>(() => {
    if (!form.watch("country")) return [];
    return State.getStatesOfCountry(form.watch("country")).map((state) => ({
      value: state.isoCode,
      label: state.name,
    }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch('country')]);

  const cities = useMemo<SelectOption[]>(() => {
    if (!form.watch("country") || !form.watch('state')) return [];
    return City.getCitiesOfState(form.watch('country'), form.watch('state')).map((city) => ({
      value: city.name,
      label: city.name,
    }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch('state')]);

  const onSubmit = async (data: FormValues) => {
    const cityDetails = City.getCitiesOfState(form.watch('country'), form.watch('state')).find((value) => value.name === data.city);

    const elevation = await getElevation(+(cityDetails?.latitude || 0), +(cityDetails?.longitude || 0));

    const geo = {
      lang: cityDetails?.latitude,
      long: cityDetails?.longitude,
      elev: elevation,
    };

    const searchParams = new URLSearchParams({
      q: JSON.stringify({
        name: data.name,
        date: `${data.year}-${data.month}-${data.day}`,
        time: `${data.timeHour}:${data.timeMinute}`,
        geo,
      }),
    });

    router.push("/birthchart?" + searchParams.toString());
  }

  return (
    <Card className="max-w-xl w-full">
      <CardHeader>
        <CardTitle>Enter Birth Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, (err) => {
            console.log(err)
          })} className="space-y-6">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date of Birth */}
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
              <div className="flex gap-4">
                <FormControl>
                  <Input
                    type="number"
                    placeholder="DD"
                    min={1}
                    max={31}
                    {...form.register("day")}
                    className="w-20 text-center"
                  />
                </FormControl>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="MM"
                    min={1}
                    max={12}
                    {...form.register("month")}
                    className="w-20 text-center"
                  />
                </FormControl>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="YYYY"
                    min={1900}
                    max={new Date().getFullYear()} // Current year as the max
                    {...form.register("year")}
                    className="w-28 text-center"
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>

            {/* Time of Birth */}
            <FormItem>
              <FormLabel>Time of Birth</FormLabel>
              <div className="flex gap-4">
                <FormControl>
                  <Input
                    type="number"
                    placeholder="HH"
                    min={0}
                    max={23}
                    {...form.register("timeHour")}
                    className="w-20 text-center"
                  />
                </FormControl>
                <span className="text-xl self-center">:</span>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="MM"
                    min={0}
                    max={59}
                    {...form.register("timeMinute")}
                    className="w-20 text-center"
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>

            {/* Country Field */}
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>

                      {countries.map((country) => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* State Field */}
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>

                      {states.map((country) => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* City Field */}
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cities.map((country) => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />


            {/* Submit Button */}
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
