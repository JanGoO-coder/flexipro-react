import {React,useState} from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import "./MyJobs.scss";
import { useFormik, Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import RefreshToken from "../login/RefreashToken";
import 'primeicons/primeicons.css';
import { useEffect } from "react";
import axios from "axios";


function Categories() {
  const [visible, setVisible] = useState(false);
  const [allCategories,setAllCategories] = useState([]);
  const [editVisible,setEditVisible] = useState(false);
  const [editModelValues,setEditModleValues] = useState({
    id:'',
    name:'',
    description:''
  })
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
      // email: Yup.string().email('Invalid email').required('Required'),
    });



    // get all Categories
    const getAllCategories = async ()=>{
        const token = localStorage.getItem('token');
        console.log('token', token)
              try {
            const response = await axios.get(
           'http://127.0.0.1:8000/api/categories',
           {
             headers: {
               Authorization: `Bearer ${token}`, // Include the authorization token in the headers
             },
           }
         );
         setAllCategories(response?.data.response?.categories)
        //  console.log(response?.data.response?.categories)  
          } catch (error) {
           console.log('erorr',error)
          }
      }

//   add new Categories
      const addNewCategory = async (category)=>{
        setEditVisible(true)
        
        const token = localStorage.getItem('token');
        console.log('token', token)
              try {
            const response = await axios.post(
           'http://127.0.0.1:8000/api/categories/add',
           {
            name:category.Title,
            description:category.Description
           },
           {
             headers: {
                 Authorization: `Bearer ${token}`, // Include the authorization token in the headers
                },
            }
            );
         getAllCategories()  
          } catch (error) {
           console.log('erorr',error)
          }
      }

    //   update categories
    const updateCategory = async (category)=>{

             console.log('updateCategory',category)
        const token = localStorage.getItem('token');
              try {
            const response = await axios.post(
           'http://127.0.0.1:8000/api/categories/update',
           {
            id:category.id,
            name:category.name,
            description:category.description
           },
           {
             headers: {
               Authorization: `Bearer ${token}`, // Include the authorization token in the headers
             },
           }
         );
         getAllCategories()  
          } catch (error) {
           console.log('erorr',error)
          }

         

     
    }

      const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      };


      function showEditModel(category){
        // console.log('showEditModel', category)
          setEditVisible(true)
          setEditModleValues({
            id:category.id,
            name: category.name,
            description: category.description
          })



      }


    //   remove job 
    const removeJob = async (jobId)=>{
        const token = localStorage.getItem('token');
        try {
      const response = await axios.post(
     `http://127.0.0.1:8000/api/categories/delete/${jobId}`,
     {},
     {
       headers: {
         Authorization: `Bearer ${token}`, // Include the authorization token in the headers
       },
     }
   );
   getAllCategories()  
    } catch (error) {
     console.log('erorr',error)
    }
    }


      useEffect(()=>{
        getAllCategories()
      },[])

  return (
    <div className="myGigs">
      <div className="container">
        <div className="title">
          <h1> Categories</h1>
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
         
       }}
       validationSchema={SignupSchema}
       onSubmit={(values, { resetForm }) => {
           resetForm()
           setVisible(false)
         // same shape as initial values
         addNewCategory(values)
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

               
                  
                  {!errors.Description&&!errors.Title?<Button severity="success" type="submit" label="Post Job" icon="pi pi-send"  />:<Button severity="success" disabled label="Loading..." />}

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
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Created at</th>
            <th>Updated at</th>
             <th>Edit</th>
            <th>Remove</th>
          </tr>
          {allCategories?.map((category, index) => {
  return (
    <tr key={index}>
      <td>
        <span style={{ fontWeight: 'bolder' }}>{index + 1}</span>
      </td>
      <td>{category.name}</td>
      <td style={{width:'300px'}}>{category.description}</td>
      <td>{formatDate(category.created_at)}</td>
      <td>{formatDate(category.updated_at)}</td>
      <td><i className=" pi pi-pencil" style={{color:'red',cursor:'pointer'}}  onClick={()=>showEditModel(category)}>
                 
        </i>
        
        
        </td>
      <td>
        <img className="delete" src="./img/delete.png" alt="" onClick={()=>{removeJob(category.id)}} />
      </td>
    </tr>
  );
})}

<Dialog header="update Job" visible={editVisible} style={{ width: '50vw' }} onHide={() => setEditVisible(false)}>

<div>

<Formik
       initialValues={{
           Title: editModelValues.name,
           Description: editModelValues.description,
           
        }}
       validationSchema={SignupSchema}
       onSubmit={(values, { resetForm }) => {
           resetForm()
           console.log(values)
           setEditVisible(false)
           const categoryValues ={
            id:editModelValues.id,
            name:values.Title,
            description:values.Description
           } 
           updateCategory(categoryValues)
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

               
                  
                  {!errors.Description&&!errors.Title?<Button severity="success" type="submit" label="update Job" icon="pi pi-send"  />:<Button severity="success" disabled label="Loading..." />}

         </Form>
       )}
     </Formik>
</div>
</Dialog>
         
        </table>
      </div>
    </div>
  );
}

export default Categories;





