"use client";
import { MapPin } from "lucide-react";
import React from "react";
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-google-places-autocomplete";
import { Coordinates } from "../(routes)/add-new-listing/page";

const GoogleAddressSearch = ({
  selectedAddress,
  setCoordinates,
}: {
  selectedAddress: (place: any) => void;
  setCoordinates: (coordinates: Coordinates) => void;
}) => {
  return (
    <div className="flex w-full items-center justify-center ">
      <MapPin className="h-full w-10 rounded-l-lg bg-primary p-2 text-secondary " />
      <GooglePlacesAutocomplete
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY}
        selectProps={{
          placeholder: "Search Property Address",
          isClearable: true,
          className: "w-full ",
          onChange: (place) => {
            console.log(place);
            selectedAddress(place);
            geocodeByAddress(place?.label as string)
              .then((results) => getLatLng(results[0]))
              .then(({ lat, lng }) =>
                setCoordinates({ lat, lng } as Coordinates),
              );
          },
          styles: {
            control: (provided) => ({
              ...provided,
              borderTopLeftRadius: "0px",
              borderBottomLeftRadius: "0px",
            }),
          },
        }}
      />
    </div>
  );
};

export default GoogleAddressSearch;
