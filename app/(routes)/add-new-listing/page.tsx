"use client";
import GoogleAddressSearch from "@/app/_components/GoogleAddressSearch";
import { Button } from "@/components/ui/button";
import { supabase } from "@/utils/superbase/client";
import { useUser } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export type Coordinates = {
  lat: number;
  lng: number;
};

const AddNewListing = () => {
  const [selectedAddress, setSelectedAddress] = React.useState<any>(); // Change any to the type you expect
  const [coordinates, setCoordinates] = React.useState<Coordinates | undefined>(
    undefined,
  );
  const [loader, setLoader] = React.useState<boolean>(false);
  const { user } = useUser();
  const router = useRouter();
  const nextHandler = async () => {
    console.log(selectedAddress, coordinates);
    setLoader(true);
    const { data, error } = await supabase
      .from("listing")
      .insert([
        {
          address: selectedAddress.label,
          coordinates: coordinates,
          createdBy: user?.primaryEmailAddress?.emailAddress,
        },
      ])
      .select();
    if (data) {
      setLoader(false);
      console.log("New data added", data);
      toast.success("New Address added successfully 🎊");
      router.replace("/edit-listing/" + data[0].id);
    }
    if (error) {
      setLoader(false);
      console.error("Error adding new data", error);
      toast.error("Error adding new data");
    }
  };
  return (
    <div className=" mt-[15%] flex h-full min-h-max flex-col items-center justify-center gap-5 ">
      <h1 className=" text-2xl font-bold ">Add New Listing</h1>
      <div className=" flex w-full max-w-[700px] flex-col gap-5 rounded-lg border p-10 shadow-md lg:px-24 ">
        <h2 className=" text-gray-500 ">
          Enter Address which you want to list
        </h2>
        <GoogleAddressSearch
          selectedAddress={(value) => setSelectedAddress(value)}
          setCoordinates={(value) => setCoordinates(value)}
        />
        <Button
          disabled={!selectedAddress || !coordinates || loader}
          onClick={nextHandler}
          className=" mt-5 w-full "
        >
          {loader ? <Loader className="animate-spin" /> : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default AddNewListing;
