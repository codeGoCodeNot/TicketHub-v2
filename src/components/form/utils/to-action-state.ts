import z, { ZodError } from "zod";

export type ActionState = {
  message: string;
  payload?: FormData;
  fieldErrors: Record<string, string[] | undefined>;
};

const fromErrorToActionState = (
  error: unknown,
  formData?: FormData,
): ActionState => {
  if (error instanceof ZodError) {
    // zod errors case
    const flattenError = z.flattenError(error).fieldErrors;
    console.log(flattenError);
    return {
      message: "",
      fieldErrors: flattenError,
      //   fieldErros will be used to show validation errors for each field in the form
      payload: formData,
    };
  } else if (error instanceof Error) {
    // db or other errors case
    return {
      message: error.message,
      fieldErrors: {},
      payload: formData,
    };
  } else {
    return {
      // generic error message for unexpected error types
      message: "Something went wrong",
      fieldErrors: {},
      payload: formData,
      // default values for the form will be taken from the payload in case of an error
    };
  }
};

export default fromErrorToActionState;
