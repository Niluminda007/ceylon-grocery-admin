import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import { AuthCardWrapper } from "./auth-card-wrapper";

export const Errorcard = () => {
  return (
    <AuthCardWrapper headerLabel="Oops! Something went wrong!">
      <div className="w-full items-center flex justify-center">
        <ExclamationTriangleIcon className="text-destrctive" />
      </div>
    </AuthCardWrapper>
  );
};
