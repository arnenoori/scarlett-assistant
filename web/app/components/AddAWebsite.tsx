import { SupabaseClient } from '@supabase/supabase-js';
import { Button, Form, Input } from '@supabase/ui';
import { useState } from 'react';
import { WebsiteContact } from '~/types/websites';

const INITIAL_VALUES = {
  website: '',
};

const validate = (values: any) => {
  const errors: any = {};

  if (!values.website) {
    errors.website = 'Required';
  } else if (!/^(https?:\/\/)?[^\s/$.?#].[^\s]*$/i.test(values.website)) {
    errors.website = 'Invalid website URL';
  }

  return errors;
};

export default function AddAWebsite({ supabase }: { supabase: SupabaseClient }) {
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [status, setStatus] = useState('');

  const handleFormSubmit = async (values: any, { setSubmitting }: any) => {
    setFormSubmitted(true);
    setStatus('Crawling for terms of service...');

    const { error } = await supabase.from<WebsiteContact>('website_contacts').insert(
      [
        {
          website: values.website,
        },
      ],
      { returning: 'minimal' }
    );

    console.log('error:', error);

    try {
      const response = await fetch('/api/findTos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: values.website }),
      });

      if (response.ok) {
        setStatus('Pulled terms of service...');
        setTimeout(() => {
          setStatus('Summarizing terms of service...');
        }, 2000);

        setTimeout(() => {
          setStatus('Now live');
          setFormSubmitted(false);
          setSubmitting(false);
        }, 4000);
      } else {
        setStatus('Error processing the request');
        setFormSubmitted(false);
        setSubmitting(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus('Error processing the request');
      setFormSubmitted(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="border-t">
      <div id="add-a-website" className="max-w-2xl mx-auto space-y-12 py-12 px-6">
        <h2 className="h2">Add a website</h2>
        <Form initialValues={INITIAL_VALUES} validate={validate} onSubmit={handleFormSubmit}>
          {({ isSubmitting, resetForm, handleSubmit }) => (
            // Remove the native <form> tag here
            <div className="grid grid-cols-1 gap-y-4">
              <Input label="Website URL *" id="website" name="website" layout="vertical" placeholder="example.com" />
              <div className="flex flex-row-reverse w-full pt-4">
                <Button size="xlarge" disabled={formSubmitted} loading={isSubmitting} htmlType="submit">
                  Send
                </Button>
              </div>
            </div>
          )}
        </Form>
        {formSubmitted && (
          <>
            <h3 className="h3">Thanks, we're processing your request. You should see the website added to the list within the next hour 👁⚡️👁</h3>
            <p>{status}</p>
          </>
        )}
      </div>
    </div>
  );
}