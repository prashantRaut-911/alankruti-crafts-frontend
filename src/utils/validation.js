export function validateCheckout(
  form
) {

  const errors = {};

  if (!form.name.trim()) {

    errors.name =
      "Full name is required.";

  }

  if (
    !/^[6-9]\d{9}$/.test(
      form.phone
    )
  ) {

    errors.phone =
      "Enter a valid 10-digit mobile number.";

  }

  if (!form.address.trim()) {

    errors.address =
      "Delivery address is required.";

  }

  if (!form.city.trim()) {

    errors.city =
      "City is required.";

  }

  if (!form.state.trim()) {

    errors.state =
      "State is required.";

  }

  if (
    !/^\d{6}$/.test(
      form.pincode
    )
  ) {

    errors.pincode =
      "Enter a valid 6-digit pincode.";

  }

  return errors;
}