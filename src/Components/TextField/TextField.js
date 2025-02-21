import { ErrorMessage, Field } from "formik";
import React from "react";
import TextError from "../TextError";
import "./TextField.css";

const TextField = ({ required, formikRequired, type, className, name, placeholder, label, isNotFormik, onChange, readOnly, disabled, autoFocus, onBlur, style }) => {
  return (
    <div className="common-textfield-wrapper">
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <strong className="text-danger">*</strong>}
        </label>
      )}
      <Field
        type={type}
        className={`form-control ${formikRequired ? "required-field" : ""} ${className}`}
        id={name}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        autoFocus={autoFocus}
        disabled={disabled}
        readOnly={readOnly}
        style={style}
      />
      {name === "notes" && <i className="text-danger">*Note: Every note should be separated with period(.)</i>}
      {!isNotFormik && <ErrorMessage name={name} component={TextError} />}
    </div>
  );
};

export default TextField;
