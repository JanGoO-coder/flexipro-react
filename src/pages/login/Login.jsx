import {React,useState} from "react";
import "./Login.scss";
import { RadioButton } from "primereact/radiobutton";
import * as Components from './Components';



function Login() {
  const [signIn, toggle] = useState(true);
  const [userType, setUserType] = useState('');
  return (
    <div className="loginPage">
                <Components.Container>
              <Components.SignUpContainer signinIn={signIn}>
                  <Components.Form>
                      <Components.Title>Create Account</Components.Title>
                      <Components.Input type='text' placeholder='Name' />
                      <Components.Input type='email' placeholder='Email' />
                      <Components.Input type='password' placeholder='Password' />
                      <div className="userSelection">
                <div className="userType">
                    <RadioButton inputId="Seller" name="user" value="Seller" onChange={(e) => setUserType(e.value)} checked={userType === 'Seller'} />
                    <label htmlFor="Seller" className="title">Seller</label>
                </div>
                <div className="userType">
                    <RadioButton inputId="Buyer" name="user" value="Buyer" onChange={(e) => setUserType(e.value)} checked={userType === 'Buyer'} />
                    <label htmlFor="Buyer" className="title">Buyer</label>
                </div>
            </div>
                      <Components.Button>Sign Up</Components.Button>
                  </Components.Form>
              </Components.SignUpContainer>

              <Components.SignInContainer signinIn={signIn}>
                   <Components.Form>
                       <Components.Title>Sign in</Components.Title>
                       <Components.Input type='email' placeholder='Email' />
                       <Components.Input type='password' placeholder='Password' />
                       {/* <Components.Anchor href='#'>Forgot your password?</Components.Anchor> */}
                       <Components.Button>Sigin In</Components.Button>
                   </Components.Form>
              </Components.SignInContainer>

              <Components.OverlayContainer signinIn={signIn}>
                  <Components.Overlay signinIn={signIn}>

                  <Components.LeftOverlayPanel signinIn={signIn}>
                      <Components.Title>Welcome Back!</Components.Title>
                      <Components.Paragraph>
                        Hey team Hope you will work hard
                      </Components.Paragraph>
                      <Components.GhostButton onClick={() => toggle(true)}>
                          Sign In
                      </Components.GhostButton>
                      </Components.LeftOverlayPanel>

                      <Components.RightOverlayPanel signinIn={signIn}>
                        <Components.Title>Hello, Professionals!</Components.Title>
                        <Components.Paragraph>
                           one step ahead connect with community
                        </Components.Paragraph>
                            <Components.GhostButton onClick={() => toggle(false)}>
                                Sigin Up
                            </Components.GhostButton> 
                      </Components.RightOverlayPanel>
                  </Components.Overlay>
                        
              </Components.OverlayContainer>

          </Components.Container>
    </div>
  )
}

export default Login