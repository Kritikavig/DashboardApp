import { useEffect, useRef } from "react";
import { useLogin } from "@pankod/refine-core";
import { Container, Box } from "@pankod/refine-mui";
import { logo,loginPage } from "assets"; 
import { CredentialResponse } from "../interfaces/google";

export const Login: React.FC = () => {
  const { mutate: login } = useLogin<CredentialResponse>();

  const GoogleButton = (): JSX.Element => {
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (typeof window === "undefined" || !window.google || !divRef.current) {
        return;
      }

      try {
        window.google.accounts.id.initialize({
          ux_mode: "popup",
          client_id: process.env.REACT_APP_CLIENT_ID,
          callback: async (res: CredentialResponse) => {
            if (res.credential) {
              login(res);
            }
          },
        });
        window.google.accounts.id.renderButton(divRef.current, {
          theme: "filled_blue",
          size: "medium",
          type: "standard",
        });
      } catch (error) {
        console.log(error);
      }
    }, []); // you can also add your client id as dependency here

    return <div ref={divRef} />;
  };

  return (
    <Box
      component="div"
      sx={{
        background: "linear-gradient(135deg, #FAB2FF 10%, #1904E5 100%)",
        backgroundSize: "cover",
        backgroundRepeat: " no-repeat",
        backgroundAttachment: "fixed",
        margin: " 5 auto",
        color: " #333333",
      }}
    >
      <Container
        component="main"
        // maxWidth="xs"
        sx={{
          display: "flex",
          margin: " 0 auto",
          width:'80%',
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Box sx={{
          margin: "auto",
          width:'80%',
          overflow:'hidden',
          display:'flex',
          borderRadius: " 10px",
          flex: "1 1 100%",
          alignItems: "stretch",
          justifyContent: "space-between",
          boxShadow: "0 0 20px 6px #090b6f85",
          height:'80%'
        }}>

          {/* left */}
          <Box
            sx={{
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              // backgroundImage:
              //   'url("https://i.pinimg.com/736x/5d/73/ea/5d73eaabb25e3805de1f8cdea7df4a42--tumblr-backgrounds-iphone-phone-wallpapers-iphone-wallaper-tumblr.jpg")',
              overflow: "hidden",
              backgroundImage:`url(${loginPage})`,
              backgroundPosition: 'center',
              padding: "30px",
              marginBottom:'0',
              width: "100%",  
              height: "auto",
              boxSizing: "border-box",
            }}
          >
          </Box>

          {/* right */}
          <Box
            sx={{
              padding: "40px",
              overflow: "hidden",
              width:'80%',
              margin: "auto",
              alignItems:'center',
              justifyContent:'center'

            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src={logo} alt="Logo" />
              <h2 style={{ color: "#fcfcfc", fontWeight: "bold", padding:'2px' }}>UpStone</h2>
            </div>

            <Box mt={4}
            sx={{
              padding: "30px",
              overflow: "hidden",
              width:'80%',
              alignContent:'center',
              justifyContent:'center',
              margin: " 0 auto",
              display:'flex',

            }}>
              <GoogleButton />
            </Box>
          </Box>

        </Box>

      </Container>
    </Box>
  );
};
