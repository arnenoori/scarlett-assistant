import { SupabaseClient } from '@supabase/supabase-js';
import { Form, Input } from '@supabase/ui';
import { useState } from 'react';
import { HoverBorderGradient } from './ui/hover-border-gradient';
import { MultiStepLoader } from './ui/multi-step-loader';
import { BackgroundBeams } from './ui/background-beams';

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
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/findTos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: values.website }),
      });

      if (response.ok) {
        setFormSubmitted(true);
      } else {
        console.error('Error submitting form:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[40rem] w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="relative z-10 text-lg md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-sans font-bold">
          Add a website
        </h1>
        <p className="text-neutral-500 max-w-lg mx-auto my-2 text-sm text-center relative z-10">
          Submit a website URL and we'll crawl for the terms of service, summarize it, and add it to our database.
        </p>
        <Form initialValues={INITIAL_VALUES} validate={validate} onSubmit={handleFormSubmit}>
          {({ isSubmitting, handleSubmit }: { isSubmitting: boolean; handleSubmit: () => void }) => (
            <div className="grid grid-cols-1 gap-y-4">
              <Input
                label="Website URL *"
                id="website"
                name="website"
                layout="vertical"
                placeholder="example.com"
                className="rounded-lg border border-neutral-800 focus:ring-2 focus:ring-teal-500 w-full relative z-10 mt-4 bg-neutral-950 placeholder:text-neutral-700"
              />
              <div className="flex flex-row-reverse w-full pt-4">
                <HoverBorderGradient
                  as="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || formSubmitted}
                  className="px-4 py-2 text-white bg-black rounded-full"
                  containerClassName="w-auto"
                >
                  {isSubmitting ? 'Sending...' : formSubmitted ? 'Sent' : 'Send'}
                </HoverBorderGradient>
              </div>
            </div>
          )}
        </Form>
        {formSubmitted}
        <MultiStepLoader loadingStates={loadingStates} loading={loading} duration={2000} />
      </div>
      <BackgroundBeams />
    </div>
  );
}