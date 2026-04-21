import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import "./Settings.css";
import defaultProfile from "../../../assets/images/profile-default.png";
import { axiosInstance, endpoints } from "../../../services/api";
import { api } from "../../../services/api";

function dataURLtoFile(dataUrl, filename) {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new File([u8arr], filename, { type: mime });
}

const Settings = () => {
  const [previewImage, setPreviewImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [initialValues, setInitialValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    notifications: true,
    aboutMe: "",
    roommatePreferences: "",
  });

  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().when("newPassword", {
      is: (val) => val && val.length > 0,
      then: Yup.string().required("Current password is required"),
    }),
    newPassword: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Must contain uppercase, lowercase, number and special character"
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .when("newPassword", {
        is: (val) => val && val.length > 0,
        then: Yup.string().required("Please confirm your password"),
      }),
    aboutMe: Yup.string().max(500, "About me should not exceed 500 characters"),
    roommatePreferences: Yup.string().max(
      300,
      "Preferences should not exceed 300 characters"
    ),
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.getUserSelf();
        const data = res.data;
        console.log("Fetched user data:", data);
        setInitialValues({
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          email: data.email || "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
          notifications: true,
          aboutMe: data.profile?.bio ?? "",  //  вместо undefined
          roommatePreferences: data.profile?.roommate_preferences ?? "",
          roomNumber: data.room_number ?? "",
          building: data.building ?? "",
          course: data.course != null ? String(data.course) : "", 
          group: data.group ?? "",
          age: data.profile?.age != null ? String(data.profile.age) : "", 
        });

        setPreviewImage(data.profile_image || null);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const payload = {
        bio: values.aboutMe || "",
        roommate_preferences: values.roommatePreferences || "",
        course: values.course || null,
        group: values.group || "",
        age: values.age || null,
      };

      await api.updateUserProfile(payload);

      if (previewImage && previewImage.startsWith("data:image")) {
        const file = dataURLtoFile(previewImage, "profile.jpg");
        const imageForm = new FormData();
        imageForm.append("profile_image", file);
        await api.updateUserProfile(imageForm);
      }

      setIsEditing(false);
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to save settings.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeletePhoto = () => {
    setPreviewImage(null);
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1 className="settings-title">Account Settings</h1>
        {!isEditing && (
          <button className="edit-button" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
        )}
      </div>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting, values }) => (
          <Form>
            <div className="settings-content">
              <div className="profile-card">
                <div className="profile-section">
                  <div className="profile-picture-container">
                    <img
                      src={previewImage || defaultProfile}
                      alt="Profile"
                      className="profile-picture"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultProfile;
                      }}
                    />
                    {isEditing && (
                      <div className="photo-actions">
                        <label className="change-photo-btn">
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleImageChange}
                          />
                          Change Photo
                        </label>
                        {(previewImage || previewImage === null) && (
                          <button
                            type="button"
                            className="delete-photo-btn"
                            onClick={handleDeletePhoto}
                          >
                            Delete Photo
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="profile-info">
                    <h2 className="profile-name">
                      {values.firstName} {values.lastName}
                    </h2>
                    <p className="profile-role">Student</p>

                    <div className="profile-details-grid">
                      <div className="detail-row">
                        <span className="detail-label">Building:</span>
                        <span className="detail-value">{values.building}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Room:</span>
                        <span className="detail-value">
                          {values.roomNumber}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Course:</span>
                        <span className="detail-value">{values.course}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Group:</span>
                        <span className="detail-value">{values.group}</span>
                      </div>

                      <div className="detail-row">
                        <span className="detail-label">Email:</span>
                        <span className="detail-value">{values.email}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Status:</span>
                        <span className="detail-value status-active">
                          Active
                        </span>
                      </div>
                    </div>

                    {values.aboutMe && (
                      <div className="about-me-section">
                        <h3 className="about-me-title">About Me</h3>
                        <p className="about-me-text">{values.aboutMe}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div
                className={`settings-form ${isEditing ? "editing-mode" : ""}`}
              >
                <div className="settings-card">
                  <div className="settings-section">
                    <div className="section-header">
                      <h2 className="section-title">About Me</h2>
                      <p className="section-description">
                        Tell your roommates about yourself
                      </p>
                    </div>

                    <div className="form-group">
                      <label htmlFor="aboutMe" className="form-label">
                        Description
                      </label>
                      <Field
                        as="textarea"
                        name="aboutMe"
                        id="aboutMe"
                        rows="4"
                        className={`form-input ${
                          errors.aboutMe && touched.aboutMe ? "input-error" : ""
                        }`}
                        disabled={!isEditing}
                        placeholder="Example: I'm a [morning person / night owl], and I prefer a [quiet / social / balanced] environment in the room. I enjoy [hobbies]. I'm [introverted / extroverted / somewhere in between]. I [clean regularly / don't mind a bit of mess]. I [do/don't] smoke. Looking for a roommate with similar habits."
                      />
                      {errors.aboutMe && touched.aboutMe && (
                        <div className="error-message">{errors.aboutMe}</div>
                      )}
                    </div>
                  </div>

                  <div className="settings-section">
                    <div className="section-header">
                      <h2 className="section-title">Roommate Preferences</h2>
                      <p className="section-description">
                        Describe your ideal roommate situation
                      </p>
                    </div>

                    <div className="form-group">
                      <label htmlFor="course" className="form-label">
                        Course
                      </label>
                      <Field
                        type="number"
                        name="course"
                        id="course"
                        className={`form-input ${
                          errors.course && touched.course ? "input-error" : ""
                        }`}
                        disabled={!isEditing}
                        placeholder="Enter your course"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="group" className="form-label">
                        Group
                      </label>
                      <Field
                        type="text"
                        name="group"
                        id="group"
                        className={`form-input ${
                          errors.group && touched.group ? "input-error" : ""
                        }`}
                        disabled={!isEditing}
                        placeholder="Enter your group"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="age" className="form-label">
                        Age
                      </label>
                      <Field
                        type="number"
                        name="age"
                        id="age"
                        className={`form-input ${
                          errors.age && touched.age ? "input-error" : ""
                        }`}
                        disabled={!isEditing}
                        placeholder="Enter your age"
                      />
                    </div>

                    <div className="form-group">
                      <label
                        htmlFor="roommatePreferences"
                        className="form-label"
                      >
                        Preferences
                      </label>
                      <Field
                        as="textarea"
                        name="roommatePreferences"
                        id="roommatePreferences"
                        rows="4"
                        className={`form-input ${
                          errors.roommatePreferences &&
                          touched.roommatePreferences
                            ? "input-error"
                            : ""
                        }`}
                        disabled={!isEditing}
                        placeholder="Example: I prefer a quiet roommate who keeps shared spaces clean and doesn't smoke."
                      />
                      {errors.roommatePreferences &&
                        touched.roommatePreferences && (
                          <div className="error-message">
                            {errors.roommatePreferences}
                          </div>
                        )}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="form-actions">
                      <button
                        type="button"
                        className="cancel-button"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="submit-button"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner"></span>
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Settings;
