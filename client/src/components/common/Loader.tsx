import { RotatingLines } from "react-loader-spinner";

export const Loader = () => (
  <div className=" flex justify-center items-center ">
    <RotatingLines
      strokeColor="#475be8"
      strokeWidth="5"
      animationDuration="0.75"
      width="96"
      visible={true}
    />
  </div>
);
