import Image from 'next/image';
import { useState } from 'react';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import backgroundImage from '~/images/background-newsletter.jpg';

function ArrowRightIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" {...props}>
      <path
        d="m14 7 5 5-5 5M19 12H5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Newsletter() {
  const [website, setWebsite] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateWebsite = (url: string) => {
    return /^(https?:\/\/)?[^\s/$.?#].[^\s]*$/i.test(url);
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateWebsite(website)) {
      alert('Invalid website URL');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/addWebsite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: website }),
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
    <section id="newsletter" aria-label="Newsletter">
      <Container>
        <div className="relative -mx-4 overflow-hidden bg-indigo-50 px-4 py-20 sm:-mx-6 sm:px-6 md:mx-0 md:rounded-5xl md:px-16 xl:px-24 xl:py-36">
          <Image
            className="absolute left-1/2 top-0 translate-x-[-10%] translate-y-[-45%] lg:translate-x-[-32%]"
            src={backgroundImage}
            alt=""
            width={919}
            height={1351}
            unoptimized
          />
          <div className="relative mx-auto grid max-w-2xl grid-cols-1 gap-x-32 gap-y-14 xl:max-w-none xl:grid-cols-2">
            <div>
              <p className="font-display text-4xl font-medium tracking-tighter text-blue-1100 sm:text-5xl">
                Add your website
              </p>
              <p className="mt-4 text-lg tracking-tight text-blue-900">
                Think we have a missing website? 
                Fill out the form to add your website
              </p>
            </div>
            <form onSubmit={handleFormSubmit}>
              <h3 className="text-lg font-semibold tracking-tight text-blue-900">
                Add a website <span aria-hidden="true">&darr;</span>
              </h3>
              <div className="mt-5 flex rounded-3xl bg-white py-2.5 pr-2.5 shadow-xl shadow-blue-900/5 focus-within:ring-2 focus-within:ring-blue-900">
                <input
                  type="text"
                  required
                  placeholder="Website URL"
                  aria-label="Website URL"
                  className="-my-2.5 flex-auto bg-transparent pl-6 pr-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
                <Button type="submit" disabled={loading}>
                  <span className="sr-only sm:not-sr-only">Submit</span>
                  <span className="sm:hidden">
                    <ArrowRightIcon className="h-6 w-6" />
                  </span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}