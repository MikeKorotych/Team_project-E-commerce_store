import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router";
import { useNavigate } from "react-router";

export const PageNotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="font bold text-[124px] text-center">404</h1>
      <div className="py-6 text-center">
        <p>
          Seems like we're nowhere!
          <br />
          The page you are looking for doesn't exist.
        </p>
        <div className="pt-4">
          <span className="text-muted-foreground">
            Here are some helpful links:
          </span>
        </div>
        <div className="flex flex-row justify-center gap-[20px] py-4">
          <Button
            variant={"ghost"}
            className="border border-solid border-gray-500 min-w-[100px]"
          >
            <Link to="/" onClick={() => navigate(-1)}>
              Go back
            </Link>
          </Button>
          <Button
            variant={"ghost"}
            className="border border-solid border-gray-500 min-w-[100px]"
          >
            <Link to="/">Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
