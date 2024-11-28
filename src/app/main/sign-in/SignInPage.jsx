import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import _ from "@lodash";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import DataHandler from "../../handlers/DataHandler";
import { useSelector } from "react-redux";
// import Cardbackground from '../../../app/shared-components/signup_image.png'
import { Modal } from "@mui/material";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("You must enter a valid email")
    .required("You must enter a email"),
  login_person: yup.string().required("Login person required"),
  password: yup
    .string()
    .required("Please enter your password.")
    .min(4, "Password is too short - must be at least 4 chars."),
});

const defaultValues = {
  email: "",
  password: "",
  login_person: "",
  remember: true,
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 600,
  bgcolor: "background.paper",
  border: "2px solid #eaecf4",
  boxShadow: 24,
  borderRadius: 4,
  p: 4,
};

function SignInPage() {
  const { control, formState, handleSubmit, setError, setValue } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [showAlert, setShowAlet] = useState(false);
  const [alertData, setAletData] = useState();
  const [showPassword, setShowPassword] = useState(false);

  const [showSecret, setShowSecret] = useState(false);

  const [loginPerson, setLoginPerson] = useState("");

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleClickShowSecret = () => setShowSecret((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const { isValid, dirtyFields, errors } = formState;

  // const dynamicImg = useSelector((state) => state.provider.dynamicImg);

  // let logoImg = localStorage.getItem("logoImg");

  useEffect(() => {
    setValue("email", "admin@fusetheme.com", {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("password", "admin", { shouldDirty: true, shouldValidate: true });
    setValue("login_person", "admin", {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [setValue]);

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const [opt, setOtp] = useState("");
  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const [username, setUsername] = useState("");
  const handleChangeUsername = (e) => {
    setUsername(e.target.value);
  };

  async function onSubmit() {
    setOpen(false);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        password,
        secret_word: opt,
        username: username,
      }),
    };
    await fetch(
      `${process.env.REACT_APP_R_SITE_API}/user/login`,
      requestOptions
    )
      .then((response) =>
        response.json().then((data) => {
          if (!data.error) {
            DataHandler.setToSession("user_id", data.data.data.user_id);
            DataHandler.setToSession("id", data.data.data.user_id);
            // DataHandler.setToSession("faviconImg", dynamicImg.data.favicon_image);
            // DataHandler.setToSession("logoImg", dynamicImg.data.logo_image);
            // DataHandler.setToSession("titleName", dynamicImg.data.title);
            DataHandler.setToSession("role", data.data.data.role);
            DataHandler.setToSession("accessToken", data.data.data.accessToken);
            DataHandler.setToSession("timeZone", data.data.data.timeZone);
            DataHandler.setToSession(
              "login_person",
              data.data.data.login_person
            );
            location.replace("/");
            //this.emit("onLogin", data.data.data);
          } else {
            setOtp("");
            setUsername("");
            setAletData({
              type: "error",
              message: data.error.message,
            });
            //this.emit("onLoginIsuue", data.error.message);
            setShowAlet(true);
            setTimeout(() => {
              setShowAlet(false);
            }, 3000);
            //_alert({ show: true, type: "error", title: data.error.message });
          }
        })
      )
      .catch((errors) => {
        {
        }
      });
  }

  const checkAndLogin = () => {
    if (id == "admin") {
      setOpen(true);
    } else {
      handleSubmit(onSubmit)();
    }
  };



  return (
    <div className="mainbox">
      <Paper className="sigin_form_wrapper">
        <div className="sigin_form">
          <div className="login_left">
            <img
              className="logo-icon small-logo"
              src="/assets/images/aslan_logo.png"
              alt="logo"
              style={{ width: '60%', height: 'auto' }}
            />
            <form
              name="loginForm"
              noValidate
              className="flex flex-col justify-center w-full mt-10"
            // onSubmit={handleSubmit(onSubmit)}
            >
              <span style={{ color: '#fff' }}>ID <span className="text-danger">*</span> </span>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    // {...field}
                    className="mb-10 inoybox"
                    size="small"
                    type="email"
                    error={!!errors.email}
                    helperText={errors?.email?.message}
                    variant="outlined"
                    autoComplete="new-mail"
                    fullWidth
                    onChange={(e) => setId(e.target.value)}
                  />
                )}
              />
              <span style={{ color: '#fff' }}>Password <span className="text-danger">*</span> </span>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <FormControl sx={{ width: "100%" }} className="inoybox" variant="outlined">
                    <OutlinedInput
                      type={showPassword ? "text" : "password"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      variant="outlined"
                      margin="dense"
                      size="small"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                    />
                  </FormControl>
                )}
              />
              <Button
                variant="contained"
                color="secondary"
                className=" w-full"
                aria-label="Sign in"
                disabled={_.isEmpty(dirtyFields) || !isValid}
                // type="submit"
                onClick={checkAndLogin}
                size="large"
                sx={{ fontSize: "16px", marginTop: "20px" }}
              >
                Login
              </Button>
            </form>
            {showAlert && (
              <div className="alert_message">
                <Alert className="alertbox" severity={alertData.type}>{alertData.message}</Alert>
              </div>
            )}
          </div>
        </div>
      </Paper >

      {/* <Box className="signup_background relative hidden md:flex flex-auto items-center justify-center h-full p-64 lg:px-112 overflow-hidden">
        <div className="z-10 relative w-full max-w-2xl">
        </div>
      </Box> */}
      <Modal
        open={open}
        className="admin_small_modal"
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={style}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* <TextField
										variant='outlined'
										fullWidth
										margin='normal'
										type='text'
										placeholder={`Username`}
										value={username}
										onChange={handleChangeUsername}
									/> */}
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                // {...field}
                className="mb-10"
                placeholder="Username"
                size="small"
                type="email"
                variant="outlined"
                hiddenLabel
                fullWidth
                onChange={handleChangeUsername}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <>
                <FormControl sx={{ width: "100%" }} className="inoybox" variant="outlined">
                  <OutlinedInput
                    id="outlined-adornment-password"
                    autoComplete="new-password"
                    placeholder="Secret code"
                    type={showSecret ? "text" : "password"}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowSecret}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showSecret ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    variant="outlined"
                    label={"Password"}
                    margin="dense"
                    size="small"
                    value={opt}
                    onChange={handleOtpChange}
                  />
                </FormControl>
              </>
            )}
          />
          <Button
            variant="contained"
            color="secondary"
            type="submit"
            onClick={handleSubmit(onSubmit)}
            sx={{ fontSize: "16px", marginTop: "20px" }}
          >
            Submit
            {/* {selectedLang.submit} */}
          </Button>
        </Box>
      </Modal>
    </div >
  );
}

export default SignInPage;
