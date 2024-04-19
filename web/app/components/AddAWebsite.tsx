import { SupabaseClient } from '@supabase/supabase-js';
import { Form, Input } from '@supabase/ui';
import { useState } from 'react';
import { WebsiteContact } from '~/types/websites';
import { HoverBorderGradient } from './ui/hover-border-gradient';
import { MultiStepLoader } from './ui/multi-step-loader';

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

const loadingStates = [
  { text: 'Crawling for terms of service...' },
  { text: 'Pulled terms of service...' },
  { text: 'Summarizing terms of service...' },
  { text: 'Now live' }
];

export default function AddAWebsite({ supabase }: { supabase: SupabaseClient }) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleFormSubmit = async (values: any, { setSubmitting }: any) => {
    setLoading(true);
    setFormSubmitted(true);
    setStatus('Crawling for terms of service...');
    setCurrentStep(0);

    const { error } = await supabase.from<WebsiteContact>('website_contacts').insert(
      [{ website: values.website }],
      { returning: 'minimal' }
    );

    if (!error) {
      try {
        const response = await fetch('/api/findTos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: values.website })
        });

        if (response.ok) {
          setStatus('Pulled terms of service...');
          setCurrentStep(1);
          setTimeout(() => {
            setStatus('Summarizing terms of service...');
            setCurrentStep(2);
          }, 2000);

          setTimeout(() => {
            setStatus('Now live');
            setCurrentStep(3);
            setFormSubmitted(false);
            setSubmitting(false);
            setLoading(false);
          }, 4000);
        } else {
          setStatus('Error processing the request');
          setFormSubmitted(false);
          setSubmitting(false);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        setStatus('Error processing the request');
        setFormSubmitted(false);
        setSubmitting(false);
        setLoading(false);
      }
    }
  };

  return (
    <div className="border-t">
      <div id="add-a-website" className="max-w-2xl mx-auto space-y-12 py-12 px-6">
        <h2 className="h2">Add a website</h2>
        <Form initialValues={INITIAL_VALUES} validate={validate} onSubmit={handleFormSubmit}>
          {({ isSubmitting, handleSubmit }: { isSubmitting: boolean; handleSubmit: () => void }) => (
            <div className="grid grid-cols-1 gap-y-4">
              <Input label="Website URL *" id="website" name="website" layout="vertical" placeholder="example.com" />
              <div className="flex flex-row-reverse w-full pt-4">
                {formSubmitted ? (
                  <button
                    onClick={handleSubmit}
                    disabled={formSubmitted}
                    className="px-4 py-2 text-white bg-black rounded-full"
                  >
                    {isSubmitting ? 'Sending...' : 'Send'}
                  </button>
                ) : (
                  <HoverBorderGradient
                    as="button"
                    onClick={handleSubmit}
                    className="px-4 py-2 text-white bg-black rounded-full"
                    containerClassName="w-auto"
                  >
                    {isSubmitting ? 'Sending...' : 'Send'}
                  </HoverBorderGradient>
                )}
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
        <MultiStepLoader loadingStates={loadingStates} loading={loading} duration={2000} />
      </div>
    </div>
  );
}