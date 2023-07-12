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
    const [jobCategories,setJobCategories] = useState(null);
    const [sendJobData,setSendJobdata] = useState({
        user_id:'',
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
         const response = await axios.get("http://127.0.0.1:8000/api/auth/getAllUsers", config);
        //  console.log('response ',response)
 
       
         setAllJobs(response.data?.Users);
         
     } catch (error) {
          console.log('Error',error)
     }
        setLoading(false);
        try {
            const config1 = {
                headers:{Authorization:`Bearer ${token}`}
            }
            const response = await axios.get('http://127.0.0.1:8000/api/jobs/company',config1);
            setJobCategories(response?.data.response?.jobs)
            // console.log('responseeee',response?.data.response?.jobs)
        } catch (error) {
            console.log('Error',error)
        }
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
                user_id:rowData.id,
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
            user_id:sendJobData.user_id,
            job_id:job.jobCategory,

        }
        const token = localStorage.getItem('token');
        try {
            const config ={
                headers:{Authorization:`Bearer ${token}`}
            }
            const response = await axios.post("http://127.0.0.1:8000/api/requests/sendRequest",data, config);
            console.log('response ',response)
              
            
        } catch (error) {
             console.log('Error',error)
        }
           setLoading(false);
       
    }


    const header = renderHeader();


    // fromik validation form 

    const SignupSchema = Yup.object().shape({
      
        // Description: Yup.string()
        //   .min(10, 'Too Short!')
        //   .max(1000, 'Too Long!')
        //   .required('Please Describe what your are offering'),
        //   Price:Yup.number().min(5,'please increase the budget')
        // // email: Yup.string().email('Invalid email').required('Required'),
        jobCategory: Yup.string().required('Please select a job category'),
      });

    return (
        <>
        <div className="card" style={{margin:'50px'}}>
        <h2 style={{marginBottom:'30px',marginTop:'15px',display:'flex',alignItems:'center',justifyContent:'center'}}>All  Technicians </h2>
            <DataTable value={allJobs} paginator rows={10} dataKey="id" filters={filters} filterDisplay="row" loading={loading}
                    globalFilterFields={['first_name', 'last_name','email','experience','user_role']} header={header} emptyMessage="No customers found.">
                
                <Column header="First Name" field='first_name'  style={{marginLeft:'15px' }}/>
                <Column header="Last Name" field='last_name'  />
                <Column header="Email" field='email'  />
                <Column header= "Experience" field='experience'/>
                <Column header = "Technician Type" field='user_role'/>
                <Column header = "Post Time" field='created_at' body={calculateTime}/>
                {/* <Column header="Status" field='status'  style={{ minWidth: '14rem' }} body={statusBodyTemplate}/> */}
                <Column header="Send Offer" body={submitPerposal}/>
            </DataTable>

        </div>
        <Dialog header="Send Offer to Technician " visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
        

  <div>

  <Formik
       initialValues={{
         jobCategory: ''
       }}
       validationSchema={SignupSchema}
       onSubmit={values => {
         // same shape as initial values
         sendTheJob(values)
         console.log(values);
       }}
     >
       {({ errors, touched }) => (
         <Form>
          
           <div className='fromikInput'>
           <Field as="select" name="jobCategory" className="field">
  {jobCategories.map(category => (
    <option key={category.id} value={category.id}>
      {category.job_title}
    </option>
  ))}
</Field>
               </div>
        
                  {!errors.jobCategory?<Button severity="success" type="submit" label="Submit Perposal" icon="pi pi-send"  />:<Button severity="success" disabled label="Loading..." />}

         </Form>
       )}
     </Formik>
</div>

             </Dialog>
        </>
    );
}
export default GetAllUsers;