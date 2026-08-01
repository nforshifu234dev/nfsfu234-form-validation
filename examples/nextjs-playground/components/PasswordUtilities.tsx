"use client";

import { useState } from "react";
import NFSFU234FormValidation from "@nfsfu234/form-validation";


export default function PasswordUtilities() {

  const validator =
    new NFSFU234FormValidation();


  const [password, setPassword] =
    useState("");

  const [generatedPassword, setGeneratedPassword] =
    useState("");

  const [checkResult, setCheckResult] =
    useState<any>(null);



  const strength =
    password
      ? validator.passwordStrength(password)
      : null;



  function checkPassword() {

    if (!password) {
      return;
    }


    const result =
      validator.checkPassword(
        password,
        8,
        20,
        true
      );


    setCheckResult(result);

  }



  async function generatePassword() {

    const result =
      await validator.generatePassword(16);


    setGeneratedPassword(result);

  }



  return (

    <div className="card">

      <h2>
        Password Utilities
      </h2>


      <p className="muted my-3">
        Test password generation, strength scoring, and validation.
      </p>



      <div className="field">

        <label>
          Password
        </label>


        <input
          className="input"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={
            (e) =>
              setPassword(e.target.value)
          }
        />

      </div>



      {
        strength && (

          <div className="console">

            <div className="console-header">
              Password Strength
            </div>


            <pre className="console-output">

{
  JSON.stringify(
    strength,
    null,
    2
  )
}

            </pre>


          </div>

        )
      }




      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          marginTop: "24px",
        }}
      >

        <button
          className="btn btn-primary"
          onClick={checkPassword}
        >
          Check Password
        </button>



        <button
          className="btn btn-secondary"
          onClick={generatePassword}
        >
          Generate Password
        </button>


      </div>




      {
        checkResult !== null && (

          <div
            className="console"
            style={{
              marginTop: "24px",
            }}
          >

            <div className="console-header">
              Validation Result
            </div>


            <pre className="console-output">

{
  typeof checkResult === "string"
    ? checkResult
    : JSON.stringify(
        checkResult,
        null,
        2
      )
}

            </pre>


          </div>

        )
      }





      {
        generatedPassword && (

          <div
            className="console"
            style={{
              marginTop: "24px",
            }}
          >

            <div className="console-header">
              Generated Password
            </div>


            <pre className="console-output">

{generatedPassword}

            </pre>


          </div>

        )
      }



    </div>

  );
}