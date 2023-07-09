import {React,useState} from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import "./MyJobs.scss";
import { useFormik, Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import RefreshToken from "../login/RefreashToken";


function MyJobs() {
  const [visible, setVisible] = useState(false);
  const token = localStorage.getItem('token');
    RefreshToken(token)
  const currentUser = {
    id: 1,
    username: "Anna",
    isSeller: true,
  };


    // fromik validation form 

    const SignupSchema = Yup.object().shape({
      Title: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Enter your service Title'),
      Description: Yup.string()
        .min(10, 'Too Short!')
        .max(1000, 'Too Long!')
        .required('Please Describe what your are Expacting'),
        Duration:Yup.number().min(1).max(5).required('Enter the DeadLine'),
        Price:Yup.number().min(5).max(1000).required('Please Enter the price')
      // email: Yup.string().email('Invalid email').required('Required'),
    });




  return (
    <div className="myGigs">
      <div className="container">
        <div className="title">
          <h1>{currentUser.isSeller ? "My Jobs" : " Orders"}</h1>
          {currentUser.isSeller && (
            // <Link to="/postJob">
            //   <button>Post Job</button>
            // </Link>
             <div className="card flex justify-content-center">
             <Button label="Post Job" icon="pi pi-external-link" onClick={() => setVisible(true)} />
             <Dialog header="Post Job" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                 
  <div>

  <Formik
       initialValues={{
         Title: '',
         Description: '',
         Duration: '',
         Price: '',
       }}
       validationSchema={SignupSchema}
       onSubmit={values => {
         // same shape as initial values
         console.log(values);
       }}
     >
       {({ errors, touched }) => (
         <Form>
            <div className='fromikInput'>
            <label htmlFor="">Job Title</label>
           <Field name="Title"  className='field' placeholder="Enter the service title"/>
           {errors.Title && touched.Title ? (
             <div className='error'>{errors.Title}</div>
           ) : null}
            </div>
           <div className='fromikInput'>
           <label htmlFor="">Description</label>
           <Field as="textarea" name="Description" className='field' placeholder="Short Description for your job"/>
           {errors.Description && touched.Description ? (
               <div className='error'>{errors.Description}</div>
               ) : null}
               </div>

               <div className='fromikInput'>
               <label htmlFor="">TimeLine</label>
           <Field as="select" name="Duration" className='field' placeholder="Set the time line">
           <option value="1">One Day</option>
             <option value="2">Two Days</option>
             <option value="3">Three Days</option>
             <option value="4">Four Days</option>
             <option value="5">Five Days</option>

           </Field>
           {errors.Duration && touched.Duration ? (
               <div className='error'>{errors.Duration}</div>
               ) : null}
               </div>

               <div className='fromikInput'>
               <label htmlFor="">Price</label>
           <Field  name="Price" className='field' placeholder="set the price"/>
           {errors.Price && touched.Price ? (
               <div className='error'>{errors.Price}</div>
               ) : null}
               </div>
                  
                  {!errors.Price&&!errors.Description&&!errors.Duration&&!errors.Title?<Button severity="success" type="submit" label="Post Job" icon="pi pi-send"  />:<Button severity="success" disabled label="Loading..." />}

         </Form>
       )}
     </Formik>
</div>
             </Dialog>
         </div>
          )}
        </div>
        <table>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Price</th>
            <th>Sales</th>
            <th>Action</th>
          </tr>
          <tr>
            <td>
              <img
                className="image"
                src="https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
            </td>
            <td>Stunning concept art</td>
            <td>59.<sup>99</sup></td>
            <td>13</td>
            <td>
              <img className="delete" src="./img/delete.png" alt="" />
            </td>
          </tr>
          <tr>
            <td>
              <img
                className="image"
                src="https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
            </td>
            <td>Ai generated concept art</td>
            <td>120.<sup>99</sup></td>
            <td>41</td>
            <td>
              <img className="delete" src="./img/delete.png" alt="" />
            </td>
          </tr>
          <tr>
            <td>
              <img
                className="image"
                src="https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
            </td>
            <td>High quality digital character</td>
            <td>79.<sup>99</sup></td>
            <td>55</td>
            <td>
              <img className="delete" src="./img/delete.png" alt="" />
            </td>
          </tr>
          <tr>
            <td>
              <img
                className="image"
                src="https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
            </td>
            <td>Illustration hyper realistic painting</td>
            <td>119.<sup>99</sup></td>
            <td>29</td>
            <td>
              <img className="delete" src="./img/delete.png" alt="" />
            </td>
          </tr>
          <tr>
            <td>
              <img
                className="image"
                src="https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
            </td>
            <td>Original ai generated digital art</td>
            <td>59.<sup>99</sup></td>
            <td>34</td>
            <td>
              <img className="delete" src="./img/delete.png" alt="" />
            </td>
          </tr>
          <tr>
            <td>
              <img
                className="image"
                src="https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
            </td>
            <td>Text based ai generated art</td>
            <td>110.<sup>99</sup></td>
            <td>16</td>
            <td>
              <img className="delete" src="./img/delete.png" alt="" />
            </td>
          </tr>
        </table>
      </div>
    </div>
  );
}

export default MyJobs;
