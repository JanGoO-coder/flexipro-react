import React, { useState, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { useFormik, Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Dialog } from 'primereact/dialog';
import RefreshToken from '../login/RefreashToken';
import axios from 'axios';
import moment from 'moment';

function GetAllUsers() {
    const [allJobs, setAllJobs] = useState(null);
    const [sendJobData,setSendJobdata] = useState({
        job_id:'',
        company_id:''
    })
    const token = localStorage.getItem('token');
    RefreshToken(token)
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        representative: { value: null, matchMode: FilterMatchMode.IN },
        status: { value: null, matchMode: FilterMatchMode.EQUALS },
        verified: { value: null, matchMode: FilterMatchMode.EQUALS }
    });
    const [loading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [visible, setVisible] = useState(false);


    const getSeverity = (status) => {
        switch (status) {
            case 'unqualified':
                return 'danger';

            case 'qualified':
                return 'success';

            case 'new':
                return 'info';

            case 'negotiation':
                return 'warning';

            case 'renewal':
                return null;
        }
    };

    const getAllRequests = async ()=>{
        const token = localStorage.getItem('token')
       try {
         const config ={
             headers:{Authorization:`Bearer ${token}`}
         }
         const response = await axios.get("http://127.0.0.1:8000/api/getAllUsers", config);
        //  console.log('response ',response)
 
       
         setAllJobs(response.data?.Users);
         
     } catch (error) {
          console.log('Error',error)
     }
        setLoading(false);
    }
    useEffect(() => {
       
        getAllRequests()
       
    }, []); // eslint-disable-line react-hooks/exhaustive-deps



    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex "style={{width:'80%'}}>
                    <label className='text-dark bold'>Serach The Job </label>
                <span className="p-input-icon-left"  style={{marginLeft:'20px'}}>
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" style={{width:'500px'}}/>
                </span>
            </div>
        );
    };

    



    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
    };


    const calculateTime= (rowData) => {
        return <div>{moment(rowData.created_at).fromNow()}</div>
    }
    const showModal = (rowData)=>{
             console.log(rowData)
             setSendJobdata({
                job_id:rowData.id,
                company_id:rowData.company_id
             })
             setVisible(true)

    }
    const submitPerposal =(rowData)=>{
        return (
            <>
            <div>

            <Button severity="success" label="Send Perposal" icon="pi pi-send" onClick={() => showModal(rowData)} />
            </div>
            
            </>
        )
    }


    

    const sendTheJob = async (job)=>{
      setVisible(false)
        const data = {
            job_id:sendJobData.job_id,
            company_id:sendJobData.company_id,
            description:job.Description
        }
        const token = localStorage.getItem('token');
        try {
            const config ={
                headers:{Authorization:`Bearer ${token}`}
            }
            // const response = await axios.post("http://127.0.0.1:8000/api/applications/sendRequest",data, config);
           //  console.log('response ',response.data?.response?.jobs)
              
            
        } catch (error) {
             console.log('Error',error)
        }
           setLoading(false);
       
    }


    const header = renderHeader();


    // fromik validation form 

    const SignupSchema = Yup.object().shape({
      
        Description: Yup.string()
          .min(10, 'Too Short!')
          .max(1000, 'Too Long!')
          .required('Please Describe what your are offering'),
          Price:Yup.number().min(5,'please increase the budget')
        // email: Yup.string().email('Invalid email').required('Required'),
      });

    return (
        <>
        <div className="card" style={{margin:'50px'}}>
        <h2 style={{marginBottom:'30px',marginTop:'15px',display:'flex',alignItems:'center',justifyContent:'center'}}>All  Users </h2>
            <DataTable value={allJobs} paginator rows={10} dataKey="id" filters={filters} filterDisplay="row" loading={loading}
                    globalFilterFields={['first_name', 'last_name','email','experience','user_role']} header={header} emptyMessage="No customers found.">
                
                <Column header="First Name" field='first_name'  style={{marginLeft:'15px' }}/>
                <Column header="Last Name" field='last_name'  />
                <Column header="Email" field='email'  />
                <Column header= "Experience" field='experience'/>
                <Column header = "User Type" field='user_role'/>
                <Column header = "Post Time" field='created_at' body={calculateTime}/>
                {/* <Column header="Status" field='status'  style={{ minWidth: '14rem' }} body={statusBodyTemplate}/> */}
                <Column header="Send Offer" body={submitPerposal}/>
            </DataTable>

        </div>
        <Dialog header="Send Offer to user " visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
        

  <div>

  <Formik
       initialValues={{
        //  Title: '',
         Description: '',
        //  Duration: '',
         Price: '',
       }}
       validationSchema={SignupSchema}
       onSubmit={values => {
         // same shape as initial values
        //  sendTheJob(values)
         console.log(values);
       }}
     >
       {({ errors, touched }) => (
         <Form>
          
           <div className='fromikInput'>
           <Field as="textarea" name="Description" className='field' placeholder="Describe what you are offering" style={{minHeight:"200px"}}/>
           {errors.Description && touched.Description ? (
               <div className='error'>{errors.Description}</div>
               ) : null}
               </div>

             

               <div className='fromikInput'>
           <Field  name="Price" className='field' placeholder="Your budget for this project"/>
           {errors.Price && touched.Price ? (
               <div className='error'>{errors.Price}</div>
               ) : null}
               </div>
                  
                  {!errors.Description?<Button severity="success" type="submit" label="Submit Perposal" icon="pi pi-send"  />:<Button severity="success" disabled label="Loading..." />}

         </Form>
       )}
     </Formik>
</div>

             </Dialog>
        </>
    );
}
export default GetAllUsers;