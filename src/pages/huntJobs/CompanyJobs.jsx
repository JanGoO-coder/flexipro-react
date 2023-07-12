import React, { useState, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import RefreshToken from '../login/RefreashToken';
import axios from 'axios';
import moment from 'moment';
import { Button } from 'primereact/button';

function CompanyJobs() {
    const [allJobs, setAllJobs] = useState(null);
  
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


    const getSeverity = (status) => {
        switch (status) {
            case 'rejected':
                return 'danger';

            case 'approved':
                return 'success';

            case 'pending':
                return 'warning';

            case 'renewal':
                return null;
        }
    };

    const getAllJObs = async ()=>{
        const token = localStorage.getItem('token')
       try {
         const config ={
             headers:{Authorization:`Bearer ${token}`}
         }
         const response = await axios.get("http://127.0.0.1:8000/api/applications/get/company", config);
        //  console.log('response ',response?.data?.response?.applications)
 
       
         setAllJobs(response?.data?.response?.applications);
         
     } catch (error) {
          console.log('Error',error)
     }
        setLoading(false);
    }
    useEffect(() => {
       
        getAllJObs()
       
    }, []); // eslint-disable-line react-hooks/exhaustive-deps


    // update job status 
    const updateJobStatus = async (applicationId,jobStatus) => {

        const token = localStorage.getItem('token')
        try {
          const config ={
              headers:{Authorization:`Bearer ${token}`}
          }
          const response = await axios.post(`http://127.0.0.1:8000/api/applications/update/${applicationId}`,{
            status:jobStatus
          }, config);
          console.log('response ',response);
  
        getAllJObs()
          
      } catch (error) {
           console.log('Error',error)
      }
    }

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
       
        return( 
        <>
        {
            rowData.status=='pending'?(
                <div style={{display:'flex',alignItems:'center',gap:'5px'}}>
                <Button  severity={getSeverity('approved')}  style={{padding:'12px',fontWeight:'bold'}} onClick={()=>{updateJobStatus(rowData.job_id,'accepted')}}>Accept</Button>
                <Button  severity={getSeverity('rejected')}  style={{padding:'12px',fontWeight:'bold'}} onClick={()=>{updateJobStatus(rowData.job_id,'rejected')}}>Reject</Button>
                
                </div>
            ):
            (
                rowData.status=='rejected'?<Tag value = {'Rejected'} severity={getSeverity('rejected')}  style={{padding:'12px',fontWeight:'bold'}}/>:
                <Tag value = {'Accepted'} severity={getSeverity('approved')}  style={{padding:'12px',fontWeight:'bold'}}/>
                
            
            )
        }
                </>
        )
    };

    const calculateTime= (rowData) => {
        return <div>{moment(rowData.created_at).fromNow()}</div>
    }

    const header = renderHeader();
    return (
        <>
        <div className="card" style={{margin:'50px'}}>
        <h2 style={{marginBottom:'30px',marginTop:'15px',display:'flex',alignItems:'center',justifyContent:'center'}}>Industory Jobs Perposals</h2>
            <DataTable value={allJobs} paginator rows={10} dataKey="id" filters={filters} filterDisplay="row" loading={loading}
                    globalFilterFields={['job_id', 'description','user_id', 'status']} header={header} emptyMessage="No customers found.">
                
                <Column header="Job Id" field='job_id'  style={{marginLeft:'15px' }}/>
                <Column header="Job Description" field='description'  />
                <Column header="Technician Id" field='user_id'  />
                <Column header = "Send Time" field='created_at' body={calculateTime}/>
                <Column header="Status" field='status'  style={{ minWidth: '14rem' }} body={statusBodyTemplate}/>
            </DataTable>

        </div>
        </>
    );
}
export default CompanyJobs;