export default function Footer() {
  return (
    <div>
      <div className="flex justify-around py-4 text-xs w-1/2 m-auto">
        <a href="/privacy.html">Privacy</a>
        <a href="/terms.html">Terms</a>
      </div>
      <div className="text-center p-6 text-xs">
        Email Purge Assistant use and transfer of information received from Google APIs 
        to any other app will adhere to <a className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"   href="https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes">Google API Services User Data Policy</a>, 
        including the Limited Use requirements.</div>
    </div>
  );
}
