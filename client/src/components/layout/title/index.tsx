import React from "react";
import { useRouterContext, TitleProps } from "@pankod/refine-core";
import { Button } from "@pankod/refine-mui";

import { logo } from "assets";
export const Title: React.FC<TitleProps> = ({ collapsed }) => {
  const { Link } = useRouterContext();

  return (
    <Button fullWidth variant="text" disableRipple>
      <Link to="/">
        {collapsed ? (
          <img src={logo} alt="logo" width="28px" />
        ) : (
          // <img src={yariga} alt="yariga" width="140px" />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={logo}
              alt="logo"
              width="50px"
              style={{
                display: "inline-block",
                padding: "2",
              }}
            />
            <h5
              style={{
                display: "inline-block",
                alignContent: "center",
                justifyContent: "center",
                fontWeight: "700",
                color:'#475BE8',
                fontFamily: "Manrope",
                fontSize: "20px",
              }}
            >
              Upstone
            </h5>
          </div>
        )}
      </Link>
    </Button>
  );
};
