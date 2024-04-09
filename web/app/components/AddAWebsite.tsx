import { SupabaseClient } from '@supabase/supabase-js'
import { Button, Form, Input, Select } from '@supabase/ui'
import { useState } from 'react'
import { WebsiteContact } from '~/types/websites'

const INITIAL_VALUES = {
  type: 'popular',
  company: '',
  website: '',
}

const validate = (values: any) => {
  const errors: any = {}

  if (!values.website) {
    errors.website = 'Required'
  } else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(values.website)) {
    errors.website = 'Invalid website URL'
  }

  return errors
}

export default function AddAWebsite({ supabase }: { supabase: SupabaseClient }) {
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false)

  const handleFormSubmit = async (values: any) => {
    const { error } = await supabase.from<WebsiteContact>('website_contacts').insert(
      [
        {
          type: values.type,
          company: values.company,
          website: values.website,
        },
      ],
      { returning: 'minimal' }
    )

    console.log('error:', error)

    setFormSubmitted(true)
  }

  return (
    <div className="border-t">
      <div id="become-a-website" className="max-w-2xl mx-auto space-y-12 py-12 px-6">
        <h2 className="h2">Add a website</h2>

        <Form initialValues={INITIAL_VALUES} validate={validate} onSubmit={handleFormSubmit}>
          {({ isSubmitting }: any) => (
            <div className="grid grid-cols-1 gap-y-4">
              <Select
                id="type"
                name="type"
                className="font-sans"
                label="Category of website?"
                layout="vertical"
              >
                <Select.Option value="popular" selected={true}>
                  popular (Agency &amp; Consulting)
                </Select.Option>
                <Select.Option value="technology">Technology</Select.Option>
              </Select>

              <Input
                label="Company Name"
                id="company"
                name="company"
                layout="vertical"
                placeholder="Example Name"
              />

              <Input
                label="Website URL *"
                id="website"
                name="website"
                layout="vertical"
                placeholder="https://example.com"
              />

              <div className="flex flex-row-reverse w-full pt-4">
                <Button
                  size="xlarge"
                  disabled={formSubmitted}
                  loading={isSubmitting}
                  htmlType="submit"
                >
                  Send
                </Button>
              </div>
            </div>
          )}
        </Form>

        {formSubmitted && <h3 className="h3">Thanks, we're processing your request. You should see the website added to the list within the next hour 👁⚡️👁</h3>}
      </div>
    </div>
  )
}