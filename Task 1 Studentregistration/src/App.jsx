import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function App() {
  // Validation Schema
  const validationSchema = Yup.object({
    name: Yup.string().min(3, "Must be at least 3 characters").required("Name is required!"),
    age: Yup.number().min(14, "Age must be at least 14 years").required("Age is required!"),
    email: Yup.string().email("Invalid email!").required("Email is required!"),
    course: Yup.string().required("Please select a course!"),
  });

  // Initial Values
  const initialValues = {
    name: "",
    age: "",
    email: "",
    course: "",
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-red- shadow-lg rounded-lg p-6 w-full max-w-md bg-[linear-gradient(to_right,#FFE000,#799F0C)]">
        <h2 className="text-center text-xl font-semibold mb-4">Student Registration Form</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            console.log("Form Submitted:", values); // Logs form data to console
            resetForm(); // Resets form after submission
          }}
        >
          {({ handleSubmit }) => (
            <Form className="space-y-4" onSubmit={handleSubmit}>
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <Field
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  className="border border-gray-300 p-2 rounded w-full"
                />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Age Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <Field
                  type="number"
                  name="age"
                  placeholder="Enter your age"
                  className="border border-gray-300 p-2 rounded w-full"
                />
                <ErrorMessage name="age" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <Field
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="border border-gray-300 p-2 rounded w-full"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Course Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Course</label>
                <Field as="select" name="course" className="border border-gray-300 p-2 rounded w-full">
                  <option value="">Select a course</option>
                  <option value="frontend">Frontend Development</option>
                  <option value="backend">Backend Development</option>
                  <option value="fullstack">Full Stack Development</option>
                  <option value="dataScience">Data Science</option>
                </Field>
                <ErrorMessage name="course" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Submit Button */}
              <button className="bg-gray-800 text-white px-4 py-2 rounded w-full" type="submit">
                Register
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
