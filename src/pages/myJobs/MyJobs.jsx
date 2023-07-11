import { React, useState } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import "./MyJobs.scss";
import { useFormik, Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import RefreshToken from "../login/RefreashToken";
import 'primeicons/primeicons.css';
import { useEffect } from "react";
import axios from "axios";


function MyJobs() {
  const [visible, setVisible] = useState(false);
  const [allJobs, setAllJobs] = useState([]);
  const [Categories,setCategories] = useState([])
  const [editVisible, setEditVisible] = useState(false);
  const [editModelValues, setEditModleValues] = useState({
    id: '',
    company_id: '',
    job_title: '',
    job_description: '',
    budget: '',
    duration_days: '',
    created_at: ''
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
    job_title: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Enter your service Title'),
    job_description: Yup.string()
      .min(10, 'Too Short!')
      .max(1000, 'Too Long!')
      .required('Please Describe what your are Expacting'),
    budget: Yup.number()
      .min(1, "budge can't be negative")
      .required("budget is reqired to post a job"),
    duration_days: Yup.number()
      .min(1, "duration can't be less than 1")
      .required("please enter duration to proceed"),
    category_id: Yup.number()
      .min(1, "id can't be negative")
      .required("every job is required be be associated with a category")
  });



  // get all Jobs
  const getAllJobs = async () => {
    getCatories()
    const token = localStorage.getItem('token');
    console.log('token', token)
    try {
      const response = await axios.get(
        'http://127.0.0.1:8000/api/jobs/company',
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the authorization token in the headers
          },
        }
      );
      setAllJobs(response?.data.response?.jobs)
      //  console.log(response?.data.response?.categories)  
    } catch (error) {
      console.log('erorr', error)
    }
  }

  const getCatories = async ()=>{
    const token = localStorage.getItem('token')
          try {
            const response = await axios.get(
              'http://127.0.0.1:8000/api/categories',
              {
                headers: {
                  Authorization: `Bearer ${token}`, // Include the authorization token in the headers
                },
              }
            );
            setCategories(response?.data?.response?.categories)
            // console.log('response', response?.data?.response?.categories)
             
          } catch (error) {
            console.log('erorr', error)
          }
  }
  //   add new Job
  const addNewJob = async (job) => {

    const token = localStorage.getItem('token');
    console.log('token', token)
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/jobs/add',
        {
          job_title: job.job_title,
          job_description: job.job_description,
          budget: job.budget,
          duration_days: job.duration_days,
          category_id: job.category_id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the authorization token in the headers
          },
        }
      );
      getAllJobs()
    } catch (error) {
      console.log('erorr', error)
    }
  }

  //   update job
  const updateJob = async (jobValue) => {

    console.log('updateJob', jobValue)
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/jobs/update',
        {
          id: jobValue.id,
          job_title: jobValue.job_title,
          job_description: jobValue.job_description,
          budget: jobValue.budget,
          duration_days: jobValue.duration_days,
          category_id: jobValue.category_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the authorization token in the headers
          },
        }
      );
      getAllJobs()
    } catch (error) {
      console.log('erorr', error)
    }




  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };


  function showEditModel(job) {
    // console.log('showEditModel', job)
    setEditVisible(true)
    setEditModleValues({
      id: job.id,
      job_title: job.job_title,
      job_description: job.job_description,
      budget: job.budget,
      duration_days: job.duration_days,
      category_id: job.category_id
    })

  }


  //   remove job 
  const removeJob = async (jobId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/jobs/delete/${jobId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the authorization token in the headers
          },
        }
      );
      getAllJobs()
    } catch (error) {
      console.log('erorr', error)
    }
  }


  useEffect(() => {
    getAllJobs()
  }, [])

  return (
    <div className="myGigs">
      <div className="container">
        <div className="title">
          <h1>Jobs</h1>
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
                      job_title: '',
                      job_description: '',
                      budget: 0,
                      duration_days: 0,
                      category_id: 0
                    }}
                    validationSchema={SignupSchema}
                    onSubmit={(job, { resetForm }) => {
                      resetForm()
                      setVisible(false)
                      // same shape as initial values
                      addNewJob(job)
                      console.log(job);
                    }}
                  >
                    {({ errors, touched }) => (
                      <Form>
                        <div className='fromikInput'>
                          <label htmlFor="">Job Title</label>
                          <Field name="job_title" className='field' placeholder="Enter the Job title" />
                          {errors.job_title && touched.job_title ? (
                            <div className='error'>{errors.job_title}</div>
                          ) : null}
                        </div>
                        <div className='fromikInput'>
                          <label htmlFor="">Job Description</label>
                          <Field as="textarea" name="job_description" className='field' placeholder="Short Description for your job" />
                          {errors.job_description && touched.job_description ? (
                            <div className='error'>{errors.job_description}</div>
                          ) : null}
                        </div>
                        <div className='fromikInput'>
                          <label htmlFor="">Budget</label>
                          <Field name="budget" className='field' placeholder="Enter the Job budget" />
                          {errors.budget && touched.budget ? (
                            <div className='error'>{errors.budget}</div>
                          ) : null}
                        </div>
                        <div className='fromikInput'>
                          <label htmlFor="">Duration (days)</label>
                          <Field name="duration_days" className='field' placeholder="Enter the Job Duraiton in days" />
                          {errors.duration_days && touched.duration_days ? (
                            <div className='error'>{errors.duration_days}</div>
                          ) : null}
                        </div>
                          
                          <div className="fromikInput">

                        <Field as="select" name="category_id" className="field">
                          {Categories?.map(category => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </Field>
                          </div>

                        {!errors.job_title && !errors.job_description && !errors.budget && !errors.duration_days && !errors.category_id ? <Button severity="success" type="submit" label="Post Job" icon="pi pi-send" /> : <Button severity="success" disabled label="Loading..." />}

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
            <th>Job Title</th>
            <th>Job Description</th>
            <th>Budget</th>
            <th>Duration (days)</th>
            <th>Category</th>
            <th>Created At</th>
            <th>Edit</th>
            <th>Remove</th>
          </tr>
          {allJobs?.map((job, index) => {
            return (
              <tr key={index}>
                <td>
                  <span style={{ fontWeight: 'bolder' }}>{index + 1}</span>
                </td>
                <td>{job.job_title}</td>
                <td style={{ width: '300px' }}>{job.job_description}</td>
                <td>{job.budget}</td>
                <td>{job.duration_days}</td>
                <td>{job.category_id}</td>
                <td>{formatDate(job.created_at)}</td>
                <td>
                  <i className=" pi pi-pencil" style={{ color: 'red', cursor: 'pointer' }} onClick={() => showEditModel(job)}></i>
                </td>
                <td>
                  <img className="delete" src="./img/delete.png" alt="" onClick={() => { removeJob(job.id) }} />
                </td>
              </tr>
            );
          })}

          <Dialog header="update Job" visible={editVisible} style={{ width: '50vw' }} onHide={() => setEditVisible(false)}>

            <div>

              <Formik
                initialValues={{
                  job_title: editModelValues.job_title,
                  job_description: editModelValues.job_description,
                  budget: editModelValues.budget,
                  duration_days: editModelValues.duration_days,
                  category_id: editModelValues.category_id
                }}
                validationSchema={SignupSchema}
                onSubmit={(job, { resetForm }) => {
                  resetForm()
                  console.log(job)
                  setEditVisible(false)
                  const jobValue = {
                    id: editModelValues.id,
                    job_title: job.job_title,
                    job_description: job.job_description,
                    budget: job.budget,
                    duration_days: job.duration_days,
                    category_id: job.category_id,
                  }
                  updateJob(jobValue)
                  // same shape as initial values
                  console.log(job);
                }}
              >
                {({ errors, touched }) => (
                  <Form>
                    <div className='fromikInput'>
                      <label htmlFor="">Job Title</label>
                      <Field name="job_title" className='field' placeholder="Enter the Job title" />
                      {errors.job_title && touched.job_title ? (
                        <div className='error'>{errors.job_title}</div>
                      ) : null}
                    </div>
                    <div className='fromikInput'>
                      <label htmlFor="">Job Description</label>
                      <Field as="textarea" name="job_description" className='field' placeholder="Short Description for your job" />
                      {errors.job_description && touched.job_description ? (
                        <div className='error'>{errors.job_description}</div>
                      ) : null}
                    </div>
                    <div className='fromikInput'>
                      <label htmlFor="">Budget</label>
                      <Field name="budget" className='field' placeholder="Enter the Job budget" />
                      {errors.budget && touched.budget ? (
                        <div className='error'>{errors.budget}</div>
                      ) : null}
                    </div>
                    <div className='fromikInput'>
                      <label htmlFor="">Duration (days)</label>
                      <Field name="duration_days" className='field' placeholder="Enter the Job Duraiton in days" />
                      {errors.duration_days && touched.duration_days ? (
                        <div className='error'>{errors.duration_days}</div>
                      ) : null}
                    </div>
                    <div className='fromikInput'>
                      <label htmlFor="">Category Id</label>
                      <Field name="category_id" className='field' placeholder="Select Category" />
                      {errors.category_id && touched.category_id ? (
                        <div className='error'>{errors.category_id}</div>
                      ) : null}
                    </div>

                    {!errors.job_title && !errors.job_description && !errors.budget && !errors.duration_days && !errors.category_id ? <Button severity="success" type="submit" label="update Job" icon="pi pi-send" /> : <Button severity="success" disabled label="Loading..." />}

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

export default MyJobs;
