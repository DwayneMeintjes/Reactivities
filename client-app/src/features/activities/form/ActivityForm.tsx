import { Segment, Button, Header } from 'semantic-ui-react';
import { useState, useEffect } from 'react';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ActivityFormValues } from '../../../app/models/activity';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { v4 as uuid } from 'uuid';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import MyTextInput from '../../../app/common/form/MyTextInput';
import MyTextArea from '../../../app/common/form/MyTextArea';
import MySelectInput from '../../../app/common/form/MySelectInput';
import { CategoryOptions } from '../../../app/common/options/CategoryOptions';
import MyDateInput from '../../../app/common/form/MyDateInput';

export default observer(function ActivityForm() {
    const { activityStore } = useStore();
    const { createActivity, updateActivity, loading, loadActivity, loadingInitial } = activityStore;
    const { id } = useParams();
    const navigate = useNavigate();

    const [activity, setActivity] = useState<ActivityFormValues>(new ActivityFormValues());

    const validationSchema = Yup.object({
        title: Yup.string().required('The activity title is required.'),
        description: Yup.string().required('The activity description is required.'),
        category: Yup.string().required(),
        date: Yup.date().required('Date is required').nullable(),
        venue: Yup.string().required(),
        city: Yup.string().required(),
    })

    useEffect(() => {
        if (id) loadActivity(id).then(activity => setActivity(new ActivityFormValues(activity)))
    }, [id, loadActivity])

    function handleFormSubmit(activity: ActivityFormValues) {
        if (!activity.id) {
            let newActivity = {
                ...activity,
                id: uuid()
            };
            createActivity(newActivity).then(() => navigate(`/activities/${activity.id}`));
        }
        else {
            updateActivity(activity).then(() => navigate(`/activities/${activity.id}`));
        }
    }

    // function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)
    // {
    //     const {name, value} = event.target;
    //     setActivity({...activity, [name]: value});
    // }

    if (loadingInitial) return <LoadingComponent content='Loading activity.....' />

    return (
        <Segment clearing>
            <Header sub color='teal' content='Activity Details' />
            <Formik
                validationSchema={validationSchema}
                enableReinitialize
                initialValues={activity}
                onSubmit={values => handleFormSubmit(values)}>
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete="off">
                        <MyTextInput name='title' placeholder='Title' />
                        <MyTextArea rows={3} placeholder='Description' name='description' />
                        <MySelectInput placeholder='Category' name='category' options={CategoryOptions} />
                        <MyDateInput
                            name='date'
                            placeholderText='Date'
                            showTimeSelect
                            timeCaption='time'
                            dateFormat='MMMM d, yyyy h:mm aa'
                        />
                        <Header sub color='teal' content='Location Details' />
                        <MyTextInput placeholder='City' name='city' />
                        <MyTextInput placeholder='Venue' name='venue' />
                        <Button 
                            loading={isSubmitting} 
                            floated='right' 
                            type='submit' 
                            content='Submit'
                            positive
                            disabled={isSubmitting || !dirty || !isValid} 
                            />
                        <Button as={Link} to="/activities" floated='right' type='button' content='Cancel' />
                    </Form>
                )}
            </Formik>
        </Segment>
    )
})