"use client";

import { useRef, useState } from "react";
import NFSFU234FormValidation from "@nfsfu234/form-validation";



export default function ValidationDemo() {

  const formRef = useRef<HTMLFormElement>(null);

  const [result, setResult] = useState<any>(null);


  async function validateForm() {

  if (!formRef.current) return;


  const validator =
    new NFSFU234FormValidation(
      formRef.current
    );


  try {

    const response =
      await validator.validate();


    setResult(response);


  } catch(error:any) {


    setResult({
      type: "error",
      message: error.message
    });


  }

  }


  async function submitForm() {

    if (!formRef.current) return;


    const validator =
      new NFSFU234FormValidation(
        formRef.current
      );


    const response =
      await validator.submit();


    setResult(response);

  }



  return (

    <div className="card">

      <h2>
        Form Validation Demo
      </h2>


      <p className="muted my-3">
        Testing NFSFU234 Form Validation v3 inside a real Next.js application.
      </p>



      <form
        ref={formRef}
        id="validation-demo-form"
      >

        <label>
          Email
        </label>

        <input
          className="input"
          name="email"
          type="email"
          placeholder="example@email.com"
          required
        />



        <label>
          Username
        </label>

        <input
          className="input"
          name="username"
          type="text"
          placeholder="Username"
          required
          minLength={3}
          maxLength={20}
        />



        <label>
          Password
        </label>

        <input
          className="input"
          name="password"
          type="password"
          placeholder="Password"
          required
          minLength={8}
        />



        <label>
          Message
        </label>

        <textarea
          className="input"
          name="message"
          placeholder="Message"
          required
          minLength={10}
        />



        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "24px",
            flexWrap: "wrap",
          }}
        >

          <button
            type="button"
            className="btn btn-primary"
            onClick={validateForm}
          >
            Validate
          </button>


          <button
            type="button"
            className="btn btn-secondary"
            onClick={submitForm}
          >
            Submit
          </button>


        </div>


      </form>



      <div
        className="console"
        style={{
          marginTop: "32px",
        }}
      >

        <div className="console-header">
          Validation Response
        </div>


        <pre className="console-output">

            {
                result
                ? result.message
                    ? `${result.type}: ${result.message}`
                    : safeJson(result)
                : "Waiting for validation..."
            }

        </pre>


      </div>


    </div>

  );
}

function safeJson(data:any){

  return JSON.stringify(
    data,
    (key,value)=>{

      if(
        key === "element" ||
        key === "form"
      ){
        return "[DOM Element]";
      }


      if(
        typeof value === "object" &&
        value !== null
      ){

        if(
          value instanceof HTMLElement
        ){
          return "[HTMLElement]";
        }

      }


      return value;

    },
    2
  );

}