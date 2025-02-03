type ResponseWraper<
  Data = Record<string, unknown>,
  Form = Record<string, unknown>,
> =
  | {
      success: false;
      message: string;
      name?: keyof Form;
    }
  | ({ success: true } & Data);

export default ResponseWraper;
