import React, { useState, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Tag } from 'primereact/tag';
import CustomerService from './CustomerService';
import { Button } from 'primereact/button';
import { useFormik, Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Dialog } from 'primereact/dialog';

function HuntJobs() {
    const [customers, setCustomers] = useState(null);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'country.name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        representative: { value: null, matchMode: FilterMatchMode.IN },
        status: { value: null, matchMode: FilterMatchMode.EQUALS },
        verified: { value: null, matchMode: FilterMatchMode.EQUALS }
    });
    const [loading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [visible, setVisible] = useState(false);

    const [statuses] = useState(['unqualified', 'qualified', 'new', 'negotiation', 'renewal']);

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

    useEffect(() => {
        CustomerService.getCustomersMedium().then((data) => {
            setCustomers(getCustomers(data));
            setLoading(false);
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const getCustomers = (data) => {
        return [...(data || [])].map((d) => {
            d.date = new Date(d.date);

            return d;
        });
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </span>
            </div>
        );
    };

    const countryBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <img alt="flag" src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png" className={`flag flag-${rowData.country.code}`} style={{ width: '24px' }} />
                <span>{rowData.country.name}</span>
            </div>
        );
    };



    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
    };

    const showModal =(rowData)=>{
             console.log(rowData)
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



    const header = renderHeader();


    // fromik validation form 

    const SignupSchema = Yup.object().shape({
        Title: Yup.string()
          .min(2, 'Too Short!')
          .max(50, 'Too Long!')
          .required('Enter your service Title'),
        Description: Yup.string()
          .min(10, 'Too Short!')
          .max(1000, 'Too Long!')
          .required('Please Describe what your are offering'),
          Duration:Yup.number().min(1).max(5).required('Enter the DeadLine'),
          Price:Yup.number().min(5).max(1000).required('Please Enter the selling price')
        // email: Yup.string().email('Invalid email').required('Required'),
      });

    return (
        <>
        <div className="card">
            <DataTable value={customers} paginator rows={10} dataKey="id" filters={filters} filterDisplay="row" loading={loading}
                    globalFilterFields={['name', 'country.name', 'representative.name', 'status']} header={header} emptyMessage="No customers found.">
                
                <Column header="Title" field='name'  style={{ minWidth: '12rem' }}/>
                <Column header="Description"  style={{ minWidth: '12rem' }} body={countryBodyTemplate}/>
                <Column header="Status" field='status'  style={{ minWidth: '14rem' }} body={statusBodyTemplate}/>
                <Column header="Send Offer"   style={{ minWidth: '14rem' }} body={submitPerposal}/>
            </DataTable>

        </div>
        <Dialog header="Send Perposal and get Offer" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
        

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
           <Field name="Title"  className='field' placeholder="please enter Pitch line"/>
           {errors.Title && touched.Title ? (
             <div className='error'>{errors.Title}</div>
           ) : null}
            </div>
           <div className='fromikInput'>
           <Field as="textarea" name="Description" className='field' placeholder="Describe what you are selling"/>
           {errors.Description && touched.Description ? (
               <div className='error'>{errors.Description}</div>
               ) : null}
               </div>

               <div className='fromikInput'>
           <Field as="select" name="Duration" className='field' placeholder="Time you will take for this project">
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
           <Field  name="Price" className='field' placeholder="Your budget for this project"/>
           {errors.Price && touched.Price ? (
               <div className='error'>{errors.Price}</div>
               ) : null}
               </div>
                  
                  {!errors.Price&&!errors.Description&&!errors.Duration&&!errors.Title?<Button severity="success" type="submit" label="Submit Perposal" icon="pi pi-send"  />:<Button severity="success" disabled label="Loading..." />}

         </Form>
       )}
     </Formik>
</div>

             </Dialog>
        </>
    );
}
export default HuntJobs;