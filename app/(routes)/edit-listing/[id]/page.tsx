"use client";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Formik, FormikHelpers } from "formik";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/utils/superbase/client";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import * as Yup from "yup";
import { Loader } from "lucide-react";

interface Listing {
  id: number;
  created_at: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  createdBy: string;
  active: boolean;
  type: string;
  propertyType: string;
  bedroom: number;
  bathroom: string | number;
  builtIn: number;
  parking: number;
  lotSize: number;
  area: number;
  price: number;
  hoa: number;
  description: string;
}

const EditListingSchema = Yup.object().shape({
  type: Yup.string().required("Select an option"),
  propertyType: Yup.string().required("Required"),
  bedroom: Yup.number().required("Required"),
  bathroom: Yup.number().required("Required"),
  builtIn: Yup.number().required("Required"),
  parking: Yup.number().required("Required"),
  lotSize: Yup.number().required("Required"),
  area: Yup.number().required("Required"),
  price: Yup.number().required("Required"),
  hoa: Yup.number().required("Required"),
  description: Yup.string().required("Required"),
});

const EditListing = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [listing, setListing] = React.useState<Listing | null>(null);
  useEffect(() => {
    const verifyUserRecord = async () => {
      const { data, error } = await supabase
        .from("listing")
        .select("*")
        .eq("id", params.id)
        .eq("createdBy", user?.primaryEmailAddress?.emailAddress);

      if (data?.length === 0) {
        router.replace("/");
        toast.error("This listing does not exist 🚫");
      }
      if (data) {
        setListing(data[0]);
      }
      if (error) {
        console.error("Error fetching data", error);
        toast.error(`Error fetching data: ${error.message}`);
      }
    };
    user && verifyUserRecord();
  }, [params.id, router, user?.primaryEmailAddress?.emailAddress, user]);

  const onSubmitHandler = async (
    values: any,
    {
      resetForm,
      setTouched,
      setFieldValue,
      setFieldTouched,
    }: FormikHelpers<any>,
  ) => {
    const touchedFields: { [key: string]: boolean } = {};
    Object.keys(values).forEach((key) => {
      touchedFields[key] = true;
    });
    setTouched(touchedFields);

    const { id, ...rest } = values;

    const { data, error } = await supabase
      .from("listing")
      .update({
        ...rest,
      })
      .eq("id", params.id)
      .select();

    if (data) {
      console.log("Data updated", data);
      toast.success("Listing updated successfully 🎊");
      resetForm();
      router.push("/");
    }

    if (error) {
      console.error("Error updating data", error);
      toast.error(`Error updating data: ${error.message}`);
    }
  };

  return (
    <div className=" my-5 flex w-full flex-col gap-16  ">
      <div className=" flex flex-col items-center justify-center gap-4 ">
        <h1 className=" text-2xl font-bold ">Edit Listing</h1>
        <h2 className=" text-lg font-medium ">
          Enter some more details about your listing
        </h2>
      </div>
      <Formik
        initialValues={{
          id: "",
          type: "",
          propertyType: "",
          bedroom: "",
          bathroom: "",
          builtIn: "",
          parking: "",
          lotSize: "",
          area: "",
          price: "",
          hoa: "",
          description: "",
        }}
        validationSchema={EditListingSchema}
        onSubmit={onSubmitHandler}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          isSubmitting,
          errors,
          handleBlur,
          isValid,
          touched,
          resetForm,
          submitCount,
          setFieldValue,
          setTouched,
        }) => (
          <form onSubmit={handleSubmit}>
            <div className=" grid gap-6 rounded-lg border p-8 shadow-md ">
              {/* 1 */}
              <div className=" grid grid-cols-1 gap-10 md:grid-cols-2 ">
                {/* Sell or Rent */}
                <div className="flex flex-col gap-2">
                  <h2 className=" text-slate-500 ">
                    Do you want to sell or rent your property?
                  </h2>
                  <Select
                    name="type"
                    // value={values.type}
                    onValueChange={(e: string) => {
                      values.type = e;
                    }}
                    defaultValue={
                      listing?.type
                        ? listing?.type
                        : values?.type
                          ? values?.type
                          : ""
                    }
                  >
                    <SelectTrigger
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full lg:w-1/2
                    ${errors?.type && touched.type ? "border-red-500" : ""} 
                    `}
                    >
                      <SelectValue
                        placeholder={
                          listing?.type
                            ? listing?.type
                            : values?.type
                              ? values?.type
                              : "Select an option"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sell">Sell</SelectItem>
                      <SelectItem value="Rent">Rent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Property Type */}
                <div className="flex flex-col gap-2">
                  <h2 className=" text-slate-500 ">Property Type</h2>
                  <Select
                    name="propertyType"
                    // value={values.propertyType}
                    onValueChange={(e: string) => {
                      values.propertyType = e;
                    }}
                    defaultValue={
                      listing?.propertyType
                        ? listing?.propertyType
                        : values?.propertyType
                          ? values?.propertyType
                          : ""
                    }
                  >
                    <SelectTrigger
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full lg:w-1/2
                    ${errors?.propertyType && touched.propertyType ? "border-red-500" : ""} 
                    `}
                    >
                      <SelectValue
                        placeholder={
                          listing?.propertyType
                            ? listing?.propertyType
                            : values?.propertyType
                              ? values?.propertyType
                              : "Select Property Type"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single Family House">
                        Single Family House
                      </SelectItem>
                      <SelectItem value="Town House">Town House</SelectItem>
                      <SelectItem value="Condo">Condo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* 2 */}
              <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                {/* Bedroom */}
                <div className="flex flex-col gap-2">
                  <h2 className=" text-slate-500 ">Bedroom</h2>
                  <Input
                    className={
                      errors?.bedroom && touched?.bedroom
                        ? "border-red-500"
                        : ""
                    }
                    type="number"
                    placeholder="Ex.2"
                    name="bedroom"
                    // onChange={() => {
                    //   setFieldValue("bedroom", values.bedroom.toString());
                    // }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    defaultValue={
                      listing?.bedroom
                        ? listing?.bedroom
                        : values?.bedroom
                          ? values?.bedroom
                          : ""
                    }
                  />
                </div>
                {/* Bathroom */}
                <div className="flex flex-col gap-2">
                  <h2 className=" text-slate-500 ">Bathroom</h2>
                  <Input
                    className={
                      errors?.bathroom && touched?.bathroom
                        ? "border-red-500"
                        : ""
                    }
                    type="number"
                    placeholder="Ex.2"
                    name="bathroom"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    defaultValue={
                      listing?.bathroom
                        ? listing?.bathroom
                        : values?.bathroom
                          ? values?.bathroom
                          : ""
                    }
                  />
                </div>
                {/* Built In */}
                <div className="flex flex-col gap-2">
                  <h2 className=" text-slate-500 ">Built In</h2>
                  <Input
                    className={
                      errors?.builtIn && touched?.builtIn
                        ? "border-red-500"
                        : ""
                    }
                    type="number"
                    placeholder="Ex.1900 Sq.ft"
                    name="builtIn"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    defaultValue={
                      listing?.builtIn
                        ? listing?.builtIn
                        : values?.builtIn
                          ? values?.builtIn
                          : ""
                    }
                  />
                </div>
              </div>
              {/* 3 */}
              <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                {/* Parking */}
                <div className="flex flex-col gap-2">
                  <h2 className=" text-slate-500 ">Parking</h2>
                  <Input
                    className={
                      errors?.parking && touched?.parking
                        ? "border-red-500"
                        : ""
                    }
                    type="number"
                    placeholder="Ex.2"
                    name="parking"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    defaultValue={
                      listing?.parking
                        ? listing?.parking
                        : values?.parking
                          ? values?.parking
                          : ""
                    }
                  />
                </div>
                {/* Lot Size */}
                <div className="flex flex-col gap-2">
                  <h2 className=" text-slate-500 ">Lot Size (Sq.ft)</h2>
                  <Input
                    className={
                      errors?.lotSize && touched?.lotSize
                        ? "border-red-500"
                        : ""
                    }
                    type="number"
                    placeholder="Ex.1900 Sq.ft"
                    name="lotSize"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    defaultValue={
                      listing?.lotSize
                        ? listing?.lotSize
                        : values?.lotSize
                          ? values?.lotSize
                          : ""
                    }
                  />
                </div>
                {/* Area */}
                <div className="flex flex-col gap-2">
                  <h2 className=" text-slate-500 ">Area (Sq.ft)</h2>
                  <Input
                    className={
                      errors?.area && touched?.area ? "border-red-500" : ""
                    }
                    type="number"
                    placeholder="Ex.1900 Sq.ft"
                    name="area"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    defaultValue={
                      listing?.area
                        ? listing?.area
                        : values?.area
                          ? values?.area
                          : ""
                    }
                  />
                </div>
              </div>
              {/* 4 */}
              <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                {/* Selling Price */}
                <div className="flex flex-col gap-2">
                  <h2 className=" text-slate-500 ">Selling Price (₦)</h2>
                  <Input
                    className={
                      errors?.price && touched?.price ? "border-red-500" : ""
                    }
                    type="number"
                    placeholder="Ex.200000"
                    name="price"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    defaultValue={
                      listing?.price
                        ? listing?.price
                        : values?.price
                          ? values?.price
                          : ""
                    }
                  />
                </div>
                {/* HOA */}
                <div className="flex flex-col gap-2">
                  <h2 className=" text-slate-500 ">HOA (Per Month) (₦)</h2>
                  <Input
                    className={
                      errors?.hoa && touched?.hoa ? "border-red-500" : ""
                    }
                    type="number"
                    placeholder="Ex.200"
                    name="hoa"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    defaultValue={
                      listing?.hoa
                        ? listing?.hoa
                        : values?.hoa
                          ? values?.hoa
                          : ""
                    }
                  />
                </div>
              </div>
              {/* 5 */}
              <div className="grid grid-cols-1">
                {/* Description */}
                <div className="flex flex-col gap-2">
                  <h2 className=" text-slate-500 ">Description</h2>
                  <Textarea
                    className={
                      errors?.description && touched?.description
                        ? "border-red-500"
                        : ""
                    }
                    placeholder="Please provide a detailed description about the property"
                    name="description"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    defaultValue={
                      listing?.description
                        ? listing?.description
                        : values?.description
                          ? values?.description
                          : ""
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4  ">
                <Button
                  className=" border-primary text-primary "
                  type="button"
                  variant="outline"
                >
                  Save
                </Button>
                <Button disabled={isSubmitting} type="submit">
                  {isSubmitting ? (
                    <Loader className="animate-spin" />
                  ) : (
                    "Save & Publish"
                  )}
                </Button>
              </div>
              <div className=" flex justify-end text-xs text-red-500 ">
                {!isValid &&
                  submitCount > 0 &&
                  "Please fill all required fields"}
              </div>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default EditListing;
