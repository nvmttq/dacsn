import React, { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { useNavigate } from "react-router-dom";


export default function LoginDemo( {setVisible} ) {
  const username = useRef("admin000");
  const password = useRef("admin000");
  const navigate = useNavigate();
  
  // const [validUsername, setValidUsername] = useState(true);
  // const [validPassword, setValidPassword] = useState(true);
  const [login, setLogin] = useState(false);

  useEffect(() => {
    if (login && username && password) {
      fetch(`http://localhost:3002/auth/login`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.current,
          password: username.current
        }),
      })
        .then(function (response) {
          return response.json();
        }).then((result) => {
          
          sessionStorage.setItem("user", JSON.stringify(result));
          console.log(result)
          setVisible(false);
          navigate("/");
        })
        .catch(function (error) {
          console.log(error);
        });
    } else setLogin(false);
  }, [login]);
  const handleLogin = (e) => {
    e.preventDefault();
  };

  return (
    <section className="h-full">
      <div className="container mx-auto h-full flex justify-center items-center">
        <div className="md:w-3/4 lg:w-2/3 xl:w-1/2">
          <img
            src={
              "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            }
            className="w-full"
            alt="Sample image"
          />
        </div>
        <div className="md:w-3/4 lg:w-2/3 xl:w-1/2 xl:pl-16">
          <form onSubmit={handleLogin}>
            <div className="form-outline mb-7">
              <span className="p-float-label">
                <InputText
                  id="username"
                  onChange={(e) => (username.current = e.target.value)}
                  className="w-full p-3"
                />
                <label htmlFor="username">Tài khoản</label>
              </span>
            </div>

            <div className="form-outline mb-3">
              <span className="p-float-label">
                <Password
                  onChange={(e) => (password.current = e.target.value)}

                  toggleMask
                  className={"w-full"}
                  inputClassName={"w-full"}
                />
                <label htmlFor="password">Mật khẩu</label>
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="form-check mb-0">
                <input
                  className="form-check-input me-2"
                  type="checkbox"
                  value=""
                  id="form2Example3"
                />
                <label className="form-check-label" htmlFor="form2Example3">
                  Remember me
                </label>
              </div>
              <a href="#!" className="text-gray-700">
                Forgot password?
              </a>
            </div>

            <div className="text-center md:text-left mt-4 pt-2">
              <Button
                className="btn btn-primary btn-lg px-12 py-3"
                onClick={(e) => setLogin(true)}
              >
                Login
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
