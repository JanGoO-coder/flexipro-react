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

function UserJob() {
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

            case 'accepted':
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
         const response = await axios.get("http://127.0.0.1:8000/api/applications/get/user", config);
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
    return <Tag value = {rowData.status} severity={getSeverity(rowData.status)} style={{padding:'12px',textTransform:'capitalize'}}/>
    
    };

    const calculateTime= (rowData) => {
        return <div>{moment(rowData.created_at).fromNow()}</div>
    }

    const header = renderHeader();
    return (
        <>
        <div className="card" style={{margin:'50px'}}>
        <h2 style={{marginBottom:'30px',marginTop:'15px',display:'flex',alignItems:'center',justifyContent:'center'}}>User Submited Jobs</h2>
            <DataTable value={allJobs} paginator rows={10} dataKey="id" filters={filters} filterDisplay="row" loading={loading}
                    globalFilterFields={['job_id', 'description','company_id', 'status']} header={header} emptyMessage="No customers found.">
                
                <Column header="Job Id" field='job_id'  style={{marginLeft:'15px' }}/>
                <Column header="Job Description" field='description'  />
                <Column header="Company Id" field='company_id'  />
                <Column header = "Send Time" field='created_at' body={calculateTime}/>
                <Column header="Status" field='status'  style={{ minWidth: '14rem' }} body={statusBodyTemplate}/>
            </DataTable>

        </div>
        </>
    );
}
export default UserJob;