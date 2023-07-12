import {React,useState,useRef, useEffect} from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import './Profile.scss';
import { useFormik, Formik, Form, Field, ErrorMessage ,useField} from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import profileImg from '../../Photos/companyGraph.jpg';
import axios from 'axios';
// import RefreashToken from '../login/RefreashToken';
import RefreshToken from '../login/RefreashToken';
import { Chip } from 'primereact/chip';
import { InputText } from "primereact/inputtext";
import { Rating } from 'primereact/rating';



function Profile() {
    const [visible, setVisible] = useState(false);
    const [profileData,setProfileData] = useState(null);
    const [skills,setSkills]  = useState([])
    const [showSkill,setShowSkill] = useState(false);
    const [addSkill,setAddSkill] = useState('');
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
                "jpeg",
                "png",
                "jpg",
            
              ];
              if (!validTypes.includes(type)) {
                valid = false;
              }
            });
          }
          return valid;
        }
      ),
        first_name:Yup.string().min(3,'Too Short!').max(100, 'Too long').required('Name is required'),
        last_name:Yup.string().min(3,'Too Short!').max(100, 'Too long').required('Name is required'),
        gender: Yup.string().required('Gender is required'),
        experience:Yup.number().min(2,'Please gain more knowledge and experience!').max(50, 'Please take a rest you are not allowed to work').required('experience is required'),
      Description: Yup.string()
        .min(10, 'Too Short!')
        .max(1000, 'Too Long!')
        .required('Please Describe what your are offering'),
    });
    const token = localStorage.getItem('token');
    RefreshToken(token)

    const showProfileData= async ()=>{
        // console.log(token)
        try {
            const config ={
                headers:{Authorization:`Bearer ${token}`}
            }
            const response = await axios.post("http://127.0.0.1:8000/api/auth/profile", {},config);
            setProfileData(response?.data?.data)
            // console.log('response ',response?.data?.data)

          
            
        } catch (error) {
             console.log('Error',error)
        }

    }

    const getSkills = async ()=>{
       const token = localStorage.getItem('token');
       console.log('token', token)
             try {
           const response = await axios.get(
          'http://127.0.0.1:8000/api/skills',
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the authorization token in the headers
            },
          }
        );
        setSkills(response?.data.response?.skills)
         } catch (error) {
          console.log('erorr',error)
         }
    }

    // remove skills 

    const removeSkill = async (userId)=>{
      const token = localStorage.getItem('token');
      console.log('token', token)
            try {
          const response = await axios.post(
         'http://127.0.0.1:8000/api/skills/remove',
         {
          id:userId
         },
         {
           headers: {
             Authorization: `Bearer ${token}`, // Include the authorization token in the headers
           },
         }
       );
       getSkills()  
        } catch (error) {
         console.log('erorr',error)
        }
    }




    useEffect(()=>{
        showProfileData()
         getSkills()

    },[])

    // edit profile section  
    const editProfile = async (profileInfo) => {
      console.log('Edit Profile', profileInfo);
      const token = localStorage.getItem('token'); // Get the authorization token from localStorage
    
      try {
        const response = await axios.post(
          'http://127.0.0.1:8000/api/auth/editProfile',
          {
            first_name: profileInfo.first_name,
            last_name: profileInfo.last_name,
            about: profileInfo.Description,
            experience: profileInfo.experience,
            gender: profileInfo.gender,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the authorization token in the headers
            },
          }
        );
        setProfileData(response?.data?.data);
        // console.log('response ',response?.data?.data);
      } catch (error) {
        console.log('Error', error);
        RefreshToken(token);
      }
    };

    const extractNameFromEmail = (email) => {
      const regex = /^([^@]+)@/;
      const match = email.match(regex);
    
      if (match && match.length > 1) {
        return match[1];
      }
    
      return email;
    };

    // add skills 
    const AddedSkills = async ()=>{
      setShowSkill(false)
            const token = localStorage.getItem('token'); // Get the authorization token from localStorage
    
      try {
        const response = await axios.post(
          'http://127.0.0.1:8000/api/skills/add',
          {
            name:addSkill
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the authorization token in the headers
            },
          }
        );
     getSkills()       
        // console.log('response ',response?.data?.response.success?.name);
      } catch (error) {
        console.log('Error', error);
        RefreshToken(token);
      }
    }

  return (
    profileData?(
      <>
         <div className="main-content">
    {/* Top navbar */}
    {/* Header */}
    <div className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center" style={{minHeight: '600px', backgroundImage: 'url(https://raw.githubusercontent.com/creativetimofficial/argon-dashboard/gh-pages/assets-old/img/theme/profile-cover.jpg)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      {/* Mask */}
      <span className="mask bg-gradient-default opacity-8" />
      {/* Header container */}
      <div className="container-fluid d-flex align-items-center">
        <div className="row">
          <div className="col-lg-7 col-md-10">
            <h1 className="display-2 text-white">{extractNameFromEmail(profileData.email)}</h1>
            <p className="text-white mt-0 mb-5" >{profileData?profileData.about:'please update your about section'}</p>
            <Button label="Edit profile" icon="pi pi-user-edit" style={{textWrap:'noWrap'}} onClick={() => setVisible(true)} />
            <Dialog header="Eidt Profile" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
            <div>

<Formik
     initialValues={{
      // profilePic:'',
       first_name:'',
       last_name:'',
       gender:'',
       experience:'',
       Description: '',
       
     }}
     validationSchema={SignupSchema}
     onSubmit={(values,{ resetForm }) => {
       // same shape as initial values
      //  console.log(values);
       editProfile(values)
       setVisible(false);
       resetForm()
       console.log("all selected files", fileRef.current.files);
     }}
   >
     {({ errors, touched }) => (
       <Form>
        
          
        {/* <div className='fromikInput'>
          <label htmlFor="">Upload Profile Picture</label>
          <FileUpload name="profilePic" fileRef={fileRef} />
         {errors.profilePic && touched.profilePic ? (
           <div className='error'>{errors.profilePic}</div>
         ) : null}
          </div> */}
    
          <div className='fromikInput'>
          <label htmlFor="">First Name</label>
         <Field name="first_name"  className='field' placeholder="Technician First Name"/>
         {errors.first_name && touched.first_name ? (
           <div className='error'>{errors.first_name}</div>
         ) : null}
          </div>
          <div className='fromikInput'>
          <label htmlFor="">Last Name</label>
         <Field name="last_name"  className='field' placeholder="Technician Last Name"/>
         {errors.last_name && touched.last_name ? (
           <div className='error'>{errors.last_name}</div>
         ) : null}
          </div>

          <div className='fromikInput'>
          <label htmlFor="">Experience</label>
         <Field name="experience"  className='field' placeholder="Enter the experience in numbers"/>
         {errors.experience && touched.experience ? (
           <div className='error'>{errors.experience}</div>
         ) : null}
          </div>
          <div className='formikInput mb-4'>
  <label htmlFor="gender">Gender</label>
  <Field name="gender" as="select" className='field'>
    <option value="">Select Gender</option>
    <option value="male">Male</option>
    <option value="female">Female</option>
    <option value="other">Other</option>
  </Field>
  {errors.gender && touched.gender ? (
    <div className='error'>{errors.gender}</div>
  ) : null}
</div>
         <div className='fromikInput'>
         <label htmlFor="">About Me</label>
         <Field as="textarea" name="Description" className='field' placeholder="Short Description for your job"/>
         {errors.Description && touched.Description ? (
             <div className='error'>{errors.Description}</div>
             ) : null}
             </div>

                {!errors.email&&!errors.Description&&!errors.gender?<Button severity="success" type="submit" label="Update Profile" icon="pi pi-user-edit"  />:<Button severity="success" disabled label="Loading..." />}

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
                  <img src="https://picsum.photos/600/600" className="rounded-circle" />
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
                  <Rating value={Math.ceil(Math.random()*5)}  cancel={false} />
                   </div>
                   </div> 
                   </div>
            </div>
            <div className="card-body pt-0 ">
              <div className="row">
                <div className="col">
                  <div className="card-profile-stats d-flex justify-content-center ">
                    <div>
                      <span className="heading">{Math.round(Math.random()*100)}</span>
                      <span className="description">Friends</span>
                    </div>
                    <div>
                      <span className="heading">{Math.round(Math.random()*100)}</span>
                      <span className="description">Photos</span>
                    </div>
                    <div>
                      <span className="heading">{Math.round(Math.random()*100)}</span>
                      <span className="description">Comments</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <h3>
                  {extractNameFromEmail(profileData.email)}
                </h3>
                <div className="h5 font-weight-300">
                  <i className="ni location_pin mr-2" />{profileData.user_role=='employee'?'Technician':'Industory'}
                </div>
                <div className="mt-4">
                {skills?.map((skill)=>{
                   return (
                    
                    <Chip
                    key={skill.id}
                    label={skill.name}
                    removable
                    style={{ margin: '5px' }}
                    onRemove={() => removeSkill(skill?.id)}
                  />
                   )
                })}
                  <Chip label='Add skills' onClick={() => setShowSkill(true)} style={{cursor:'pointer',fontWeight:'bolder',marginLeft:'5px'}}/>
                {/* <Button label="Show" icon="pi pi-external-link" onClick={() => setShowSkill(true)} /> */}
<Dialog header="Please add the skill here" visible={showSkill} style={{ width: '50vw' }} onHide={() => setShowSkill(false)}>
   
    <div className="flex justify-content-center" style={{width:'100%'}}>
            <InputText value={addSkill} onChange={(e)=>setAddSkill(e.target.value)} style={{width:'80%',marginRight:'10px'}} />
              {addSkill.length>3?<Button label="addSkill"   icon="pi pi-external-link" onClick={() => AddedSkills()}/>:<Button label="AddSkill" disabled/>}
        </div>

</Dialog>
                </div>
                <hr className="my-4" />
                <p>Hi my name is {profileData.first_name} Here is my short introduction , {profileData.about}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-8 order-xl-1">
  <div className="card bg-secondary shadow my-4">
    <div className="card-header bg-white border-0">
      <div className="row align-items-center">
        <div className="col-8">
          <h3 className="mb-0">{profileData.user_role=='employee'?'Technician':'Industory'} account</h3>
        </div>
      </div>
    </div>
    <div className="card-body">
      <div>
        <h6 className="heading-small text-muted mb-4">{profileData.user_role} information</h6>
        <div className="pl-lg-4">
          <div className="row">
            <div className="col-lg-6">
            <label className='form-control-label'>Username</label>
              <div className="form-control form-control-alternative my-2">
                <div className="input-value">{extractNameFromEmail(profileData.email)}</div>
              </div>
            </div>
            <div className="col-lg-6">
            <label className='form-control-label'>Email</label>
              <div className="form-control form-control-alternative">
                <div className="input-value">{profileData.email}</div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6">
            <label className='form-control-label'>First Name</label>
              <div className="form-control form-control-alternative">
                <div className="input-value">{profileData.first_name}</div>
              </div>
            </div>
            <div className="col-lg-6">
            <label className='form-control-label'>Last Name</label>
              <div className="form-control form-control-alternative ">
                <div className="input-value">{profileData.last_name}</div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6">
            <label className='form-control-label'>User Id</label>
              <div className="form-control form-control-alternative ">
                <div className="input-value">{profileData.id}</div>
              </div>
            </div>
            <div className="col-lg-6">
                <label className='form-control-label'>Experience</label>
              <div className="form-control form-control-alternative ">
                <div className="input-value">{`${profileData.experience} years`}</div>
              </div>
            </div>
          </div>
        </div>
        <hr className="my-4" />
        {/* Description */}
        <h6 className="heading-small text-muted mb-4">About me</h6>
        <div className="pl-lg-4">
        <label className='form-control-label'>About Me</label>
          <div className="form-control form-control-alternative ">
            <div className="input-value">{profileData.about}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


      </div>
    </div>
  </div>
        </>
    ):<h1 style={{display:'flex',alignItems:'center',justifyContent:'center',width:'100%',height:'300px',fontSize:'40px'}}>Profile is Loading ........</h1>
     
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