import React from "react";
import { useEffect } from "react";
import { NavLink, Link, Outlet, useLoaderData, Form, redirect, useNavigation } from "react-router-dom";
import {useSubmit, } from "react-router-dom";
import {getContacts, createContact} from "../contact";

export async function action() 
{
  const contact = await createContact();
  return redirect(`/contacts/${contact.id}/edit`);
}
export async function loader({request}) 
{
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return {contacts, q};
}
export default function Root() 
{
  const {contacts, q} = useLoaderData();
  const navigation = useNavigation();
  const submit = useSubmit();
  useEffect(()=>{
    document.getElementById("q").value = q;
  }, [q]);
  const searching = navigation.location && 
  new URLSearchParams(navigation.location.search).has("q");
  return (
    <React.Fragment>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              className={searching? "loading": ""}
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              defaultValue={q}
              onChange={(event) => {
                const isFirstSearch = q == null;
                submit(event.currentTarget.form, {replace: !isFirstSearch,})}}
            />
            <div
              id="search-spinner"
              aria-hidden
              hidden={!searching}
            />
            <div
              className="sr-only"
              aria-live="polite"
            ></div>
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
        {contacts.length ? (
          <ul>
            {contacts.map((contact) => (
              <li key={contact.id}>
                <NavLink to={`contacts/${contact.id}`} className={({ isActive, isPending }) =>
                isActive
                  ? "active"
                  : isPending
                  ? "pending"
                  : ""}>
                  {contact.first || contact.last ? (
                    <React.Fragment>
                      {contact.first} {contact.last}
                    </React.Fragment>
                  ) : (
                    <i>No Name</i>
                  )}{" "}
                  {contact.favorite && <span>★</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        ) : (
          <p>
            <i>No contacts</i>
          </p>
        )}
        </nav>
      </div>
      <div id="detail" className={navigation.state === "loading" ? "loading" : ""}>
      <Outlet/>
      </div>
    </React.Fragment>
  );
}


const conceptLink = <ul>
<li>
{/* Client side routing allows our app to update
the url without requesting another document from the server.
Instead, the app can immediately render new UI. We make this happen
the Link component provided by react-router-dom */}
  <Link to={`contacts/1`}>Your Name</Link>
{/* You can open the network tab in the browser devtools to 
see that it's not requesting documents anymore. */}
{/* Link only changes the url  */}
</li>

<li>
{/* The anchor tag requests documents from the server but
Link does not  */}
  <a href={`/contacts/2`}>Your Friend</a>
</li>
</ul>;