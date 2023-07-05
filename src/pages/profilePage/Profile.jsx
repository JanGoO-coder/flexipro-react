import {React,useState,useRef} from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import './Profile.scss';
import { useFormik, Formik, Form, Field, ErrorMessage ,useField} from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';



function Profile() {
    const [visible, setVisible] = useState(false);
    const fileRef = useRef(null);


    // fromik validation form 

    const SignupSchema = Yup.object().shape({
      profilePic:Yup.mixed().test("is-file-too-big", "File exceeds 10MB", () => {
        let valid = true;
        const files = fileRef?.current?.files;
        if (files) {
          const fileArr = Array.from(files);
          fileArr.forEach((file) => {
            const size = file.size / 1024 / 1024;
            if (size > 10) {
              valid = false;
            }
          });
        }
        return valid;
      })
      .test(
        "is-file-of-correct-type",
        "File is not of supported type",
        () => {
          let valid = true;
          const files = fileRef?.current?.files;
          if (files) {
            const fileArr = Array.from(files);
            fileArr.forEach((file) => {
              const type = file.type.split("/")[1];
              const validTypes = [
                "zip",
                "xml",
                "xhtml+xml",
                "plain",
                "svg+xml",
                "rtf",
                "pdf",
                "jpeg",
                "png",
                "jpg",
                "ogg",
                "json",
                "html",
                "gif",
                "csv"
              ];
              if (!validTypes.includes(type)) {
                valid = false;
              }
            });
          }
          return valid;
        }
      ),
      username: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Enter your service Title'),
        email: Yup.string().email('Invalid email').required('Required'),
        firstname:Yup.string().min(3,'Too Short!').max(100, 'Too long').required('Name is required'),
        lastname:Yup.string().min(3,'Too Short!').max(100, 'Too long').required('Name is required'),
        userId:Yup.number().required('userId is required'),
        experience:Yup.string().min(3,'Too Short!').max(150, 'Too long').required('experience is required'),
      Description: Yup.string()
        .min(10, 'Too Short!')
        .max(1000, 'Too Long!')
        .required('Please Describe what your are offering'),
    });


  return (
    <div className="main-content">
    {/* Top navbar */}
    {/* Header */}
    <div className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center" style={{minHeight: '600px', backgroundImage: 'url(https://raw.githubusercontent.com/creativetimofficial/argon-dashboard/gh-pages/assets-old/img/theme/profile-cover.jpg)', backgroundSize: 'cover', backgroundPosition: 'center top'}}>
      {/* Mask */}
      <span className="mask bg-gradient-default opacity-8" />
      {/* Header container */}
      <div className="container-fluid d-flex align-items-center">
        <div className="row">
          <div className="col-lg-7 col-md-10">
            <h1 className="display-2 text-white">Hello Jesse</h1>
            <p className="text-white mt-0 mb-5">This is your profile page. You can see the progress you've made with your work and manage your projects or assigned tasks</p>
            <Button label="Edit profile" icon="pi pi-user-edit" onClick={() => setVisible(true)} />
            <Dialog header="Eidt Profile" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
            <div>

<Formik
     initialValues={{
      profilePic:'',
       username: '',
       email:'',
       firstname:'',
       lastname:'',
       userId:'',
       experience:'',
       Description: '',
       
     }}
     validationSchema={SignupSchema}
     onSubmit={values => {
       // same shape as initial values
       console.log(values);
       console.log("all selected files", fileRef.current.files);
     }}
   >
     {({ errors, touched }) => (
       <Form>
        
          
        <div className='fromikInput'>
          <label htmlFor="">Upload Profile Picture</label>
          <FileUpload name="profilePic" fileRef={fileRef} />
         {errors.profilePic && touched.profilePic ? (
           <div className='error'>{errors.profilePic}</div>
         ) : null}
          </div>
          <div className='fromikInput'>
          <label htmlFor="">User Name</label>
         <Field name="username"  className='field' placeholder="user name"/>
         {errors.username && touched.username ? (
           <div className='error'>{errors.username}</div>
         ) : null}
          </div>

          <div className='fromikInput'>
          <label htmlFor="">Email address</label>
         <Field name="email"  className='field' placeholder="email address"/>
         {errors.email && touched.email ? (
           <div className='error'>{errors.email}</div>
         ) : null}
          </div>
          <div className='fromikInput'>
          <label htmlFor="">First Name</label>
         <Field name="firstname"  className='field' placeholder="first name"/>
         {errors.firstname && touched.firstname ? (
           <div className='error'>{errors.firstname}</div>
         ) : null}
          </div>
          <div className='fromikInput'>
          <label htmlFor="">Last Name</label>
         <Field name="lastname"  className='field' placeholder="last name"/>
         {errors.lastname && touched.lastname ? (
           <div className='error'>{errors.lastname}</div>
         ) : null}
          </div>
          <div className='fromikInput'>
          <label htmlFor="">User Id</label>
         <Field name="userId"  className='field' placeholder="User Id"/>
         {errors.userId && touched.userId ? (
           <div className='error'>{errors.userId}</div>
         ) : null}
          </div>
          <div className='fromikInput'>
          <label htmlFor="">Experience</label>
         <Field name="experience"  className='field' placeholder="Experience"/>
         {errors.experience && touched.experience ? (
           <div className='error'>{errors.experience}</div>
         ) : null}
          </div>
         <div className='fromikInput'>
         <label htmlFor="">About Me</label>
         <Field as="textarea" name="Description" className='field' placeholder="Short Description for your job"/>
         {errors.Description && touched.Description ? (
             <div className='error'>{errors.Description}</div>
             ) : null}
             </div>

                {!errors.email&&!errors.Description&&!errors.userId&&!errors.username?<Button severity="success" type="submit" label="Update Profile" icon="pi pi-user-edit"  />:<Button severity="success" disabled label="Loading..." />}

       </Form>
     )}
   </Formik>
</div>
             </Dialog>
          </div>
        </div>
      </div>
    </div>
    {/* Page content */}
    <div className="container-fluid mt--7">
      <div className="row">
        <div className="col-xl-4 order-xl-2 mb-5 mb-xl-0">
          <div className="card card-profile shadow">
            <div className="row justify-content-center">
              <div className="col-lg-3 order-lg-2">
                <div className="card-profile-image">
                  <Link href="#">
                    <img src="https://demos.creative-tim.com/argon-dashboard/assets-old/img/theme/team-4.jpg" className="rounded-circle" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="card-header text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
              <div className="d-flex justify-content-between">
                <a href="#" className="btn btn-sm btn-info mr-4">Connect</a>
                <a href="#" className="btn btn-sm btn-default float-right">Message</a>
              </div>
            </div>
            <div className="card-body pt-0 pt-md-4">
              <div className="row">
                <div className="col">
                  <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                    <div>
                      <span className="heading">22</span>
                      <span className="description">Friends</span>
                    </div>
                    <div>
                      <span className="heading">10</span>
                      <span className="description">Photos</span>
                    </div>
                    <div>
                      <span className="heading">89</span>
                      <span className="description">Comments</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <h3>
                  Jessica Jones<span className="font-weight-light">, 27</span>
                </h3>
                <div className="h5 font-weight-300">
                  <i className="ni location_pin mr-2" />Bucharest, Romania
                </div>
                <div className="h5 mt-4">
                  <i className="ni business_briefcase-24 mr-2" />Solution Manager - Creative Tim Officer
                </div>
                <div>
                  <i className="ni education_hat mr-2" />University of Computer Science
                </div>
                <hr className="my-4" />
                <p>Ryan — the name taken by Melbourne-raised, Brooklyn-based Nick Murphy — writes, performs and records all of his own music....</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-8 order-xl-1">
          <div className="card bg-secondary shadow">
            <div className="card-header bg-white border-0">
              <div className="row align-items-center">
                <div className="col-8">
                  <h3 className="mb-0">My account</h3>
                </div>
              </div>
            </div>
            <div className="card-body">
              <form>
                <h6 className="heading-small text-muted mb-4">User information</h6>
                <div className="pl-lg-4">
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="form-group focused">
                        <label className="form-control-label" htmlFor="input-username">Username</label>
                        <input type="text" disabled id="input-username" className="form-control form-control-alternative"  defaultValue="lucky.jesse" />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label className="form-control-label" htmlFor="input-email">Email address</label>
                        <input type="email" disabled id="input-email" className="form-control form-control-alternative" defaultValue="jesse@example.com" />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="form-group focused">
                        <label className="form-control-label" htmlFor="input-first-name">First name</label>
                        <input type="text" disabled id="input-first-name" className="form-control form-control-alternative"  defaultValue="Lucky" />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group focused">
                        <label className="form-control-label" htmlFor="input-last-name">Last name</label>
                        <input type="text" disabled id="input-last-name" className="form-control form-control-alternative"  defaultValue="Jesse" />
                      </div>
                    </div>
                  </div>
                    <div className="row">

                  <div className="col-lg-6">
                      <div className="form-group focused">
                        <label className="form-control-label" htmlFor="input-username">User Id</label>
                        <input type="text" disabled id="input-username" className="form-control form-control-alternative"  defaultValue="111123213"  />
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="form-group">
                        <label className="form-control-label" htmlFor="input-email">Experience</label>
                        <input type="text" disabled id="input-username" className="form-control form-control-alternative"  defaultValue="experience...."/>
                      </div>
                    </div>
                   
                    
                    </div>
                   
                </div>
                <hr className="my-4" />
                {/* Description */}
                <h6 className="heading-small text-muted mb-4">About me</h6>
                <div className="pl-lg-4">
                  <div className="form-group focused">
                    <label>About Me</label>
                    <textarea disabled rows={4} className="form-control form-control-alternative" placeholder="A few words about you ..." defaultValue={"A beautiful Dashboard for Bootstrap 4. It is Free and Open Source."} />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Profile


const FileUpload = ({ fileRef, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div>
      <label htmlFor="files">Choose files</label>{" "}
      <input ref={fileRef} multiple={true} type="file" {...field} />
      {meta.touched && meta.error ? (
        <div style={{ color: "red" }}>{meta.error}</div>
      ) : null}
    </div>
  );
};