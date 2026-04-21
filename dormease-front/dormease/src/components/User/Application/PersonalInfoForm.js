import React, { useState, useRef, useEffect } from "react";
import "./PersonalInfoForm.css";
import { axiosInstance } from "../../../services/api";

const PersonalInfoForm = () => {
  const [formData, setFormData] = useState({
    iin: "",
    idDocument: null,
    gender: "",
    city: "",
    cityDocument: null,
    benefitCategory: "",
    benefitDocument: null,
  });

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [existingApplication, setExistingApplication] = useState(null);
  const [isLoadingApp, setIsLoadingApp] = useState(true);

  const [previews, setPreviews] = useState({
    idDocument: null,
    cityDocument: null,
    benefitDocument: null,
  });

  const benefitCategories = [
    {
      id: 1,
      name: "Category 1",
      description:
        "Orphans and children left without parental care, persons with disabilities of group 1 or 2, etc.",
    },
    {
      id: 2,
      name: "Category 2",
      description:
        "Persons with disabilities of group 3, persons whose one or both parents have disabilities, etc.",
    },
    {
      id: 3,
      name: "Category 3",
      description:
        "Students participating in the project “Mangilik El Zhastary - Industry!” (“Serpin - 2050”)",
    },
    {
      id: 4,
      name: "Category 4",
      description:
        "Holders of the “Altyn Belgi” award, winners of Olympiads and competitions",
    },
    {
      id: 5,
      name: "Category 5",
      description: "Students with high scores on UNT or CT exams",
    },
    {
      id: 6,
      name: "Category 6",
      description: "Senior students with high academic achievements",
    },
    {
      id: 7,
      name: "Category 7",
      description: "Other students, including foreigners",
    },
  ];

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await axiosInstance.get("api/applications/my/");
        const apps = res.data;
        if (apps.length > 0) {
          const latest = apps.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          )[0];
          setExistingApplication(latest);
        }
      } catch (err) {
        console.warn("No existing application");
      } finally {
        setIsLoadingApp(false);
      }
    };

    fetchApplication();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "iin") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length <= 12) {
        setFormData((prev) => ({ ...prev, [name]: numericValue }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateIIN = (iin) => {
    return iin.length !== 12 ? "The IIN must contain exactly 12 digits." : "";
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, [field]: file }));

    const reader = new FileReader();
    if (file.type.startsWith("image/")) {
      reader.onloadend = () => {
        setPreviews((prev) => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
    } else if (file.type === "application/pdf") {
      setPreviews((prev) => ({ ...prev, [field]: file.name }));
    } else {
      setPreviews((prev) => ({ ...prev, [field]: null }));
    }
  };

  const removeFile = (field) => {
    setFormData((prev) => ({ ...prev, [field]: null }));
    setPreviews((prev) => ({ ...prev, [field]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    const errorMsg = validateIIN(formData.iin);
    if (errorMsg) newErrors.iin = errorMsg;
    if (!formData.idDocument)
      newErrors.idDocument = "Please upload your identity document.";
    if (!formData.gender) newErrors.gender = "Please select your gender.";
    if (formData.city && formData.city !== "astana" && !formData.cityDocument)
      newErrors.cityDocument =
        "Please upload a document proving your city of residence.";
    if (formData.benefitCategory && !formData.benefitDocument)
      newErrors.benefitDocument =
        "Please upload a document proving your benefit category.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setShowSuccess(false);
      let fileToSend = formData.benefitCategory
        ? formData.benefitDocument
        : formData.idDocument;

      const formPayload = new FormData();
      formPayload.append("iin", formData.iin);
      formPayload.append("gender", formData.gender);
      formPayload.append("city", formData.city);
      formPayload.append(
        "priority",
        formData.benefitCategory ? Number(formData.benefitCategory) : 7
      );
      if (formData.idDocument) {
        formPayload.append("identification_card", formData.idDocument);
      }
      if (formData.city !== "astana" && formData.cityDocument) {
        formPayload.append("city_proof_document", formData.cityDocument);
      }
      if (formData.benefitCategory && formData.benefitDocument) {
        formPayload.append("benefit_proof_document", formData.benefitDocument);
      }
      const response = await axiosInstance.post(
        "api/applications/",
        formPayload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Successfully submitted:", response.data);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Submission error:", error);
      alert("Error submitting the form. Please try again.");
    }
  };

  const handleResubmit = () => {
  setFormData({
    iin: '',
    idDocument: null,
    gender: '',
    city: '',
    cityDocument: null,
    benefitCategory: '',
    benefitDocument: null
  });
  setErrors({});
  setShowSuccess(false);
  setExistingApplication(null);
  setPreviews({
    idDocument: null,
    cityDocument: null,
    benefitDocument: null
  });
};

  return (
    <div className="form-wrapper">
      <div className="personal-info-container">
        <h1>Application Form</h1>
        <p className="subtitle">
          Please upload all files needed for the dormitory application.
        </p>

        {isLoadingApp ? (
          <p>Loading...</p>
        ) : existingApplication ? (
          <div className="alert-box">
            {existingApplication.status === "PENDING" && (
              <p className="info-message">
                Your application is under review. Please wait for the result.
              </p>
            )}
            {existingApplication.status === "APPROVED" && (
              <p className="success-message">
                Your application has been approved.
              </p>
            )}
            {existingApplication.status === "REJECTED" && (
              <p className="error-message">
                Your application was rejected. You may contact support for
                clarification.
              </p>
            )}

            {existingApplication?.status === 'CANCELED' && (
              <>
                <p className="error-message">
                  Your application was canceled.
                  {existingApplication.admin_comment && (
                    <>
                      {' '}
                      Comment: <span>{existingApplication.admin_comment}</span>
                    </>
                  )}
                </p>
                <button onClick={handleResubmit} className="resubmit-button">
                  Resubmit
                </button>
              </>
            )}

          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* IIN */}
            <div className="form-group">
              <label htmlFor="iin">IIN*</label>
              <input
                type="text"
                id="iin"
                name="iin"
                value={formData.iin}
                onChange={handleInputChange}
                required
                maxLength="12"
                placeholder="Enter your IIN"
              />
              {errors.iin && <p className="error">{errors.iin}</p>}
            </div>

            {/* ID Document */}
            <div className="form-group">
              <label>Identification card*</label>
              <FileUpload
                field="idDocument"
                file={formData.idDocument}
                preview={previews.idDocument}
                onChange={handleFileChange}
                onRemove={removeFile}
                accept=".pdf,.jpg,.jpeg,.png"
              />
              {errors.idDocument && (
                <div className="error">{errors.idDocument}</div>
              )}
            </div>

            {/* Gender */}
            <div className="form-group">
              <label htmlFor="gender">Gender*</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {errors.gender && <p className="error">{errors.gender}</p>}
            </div>

            {/* City */}
            <div className="form-group">
              <label htmlFor="city">City of residence*</label>
              <select
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
              >
                <option value="">Select your city</option>
                <option value="astana">Astana</option>
                <option value="other">Other city</option>
              </select>
            </div>

            {/* City Document */}
            {formData.city && formData.city !== "astana" && (
              <div className="form-group">
                <label>Document proving city of residence*</label>
                <FileUpload
                  field="cityDocument"
                  file={formData.cityDocument}
                  preview={previews.cityDocument}
                  onChange={handleFileChange}
                  onRemove={removeFile}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                {errors.cityDocument && (
                  <div className="error">{errors.cityDocument}</div>
                )}
              </div>
            )}

            {/* Benefit Category */}
            <div className="form-group">
              <label htmlFor="benefitCategory">Benefit category</label>
              <select
                id="benefitCategory"
                name="benefitCategory"
                value={formData.benefitCategory}
                onChange={handleInputChange}
              >
                <option value="">Select benefit category</option>
                {benefitCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name} - {category.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Benefit Document */}
            {formData.benefitCategory && (
              <div className="form-group">
                <label>Document proving benefit category*</label>
                <FileUpload
                  field="benefitDocument"
                  file={formData.benefitDocument}
                  preview={previews.benefitDocument}
                  onChange={handleFileChange}
                  onRemove={removeFile}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                {errors.benefitDocument && (
                  <div className="error">{errors.benefitDocument}</div>
                )}
              </div>
            )}

            {showSuccess && (
              <div className="custom-alert">
                <h4>Success!</h4>
                <p>Form submitted successfully.</p>
              </div>
            )}

            <div className="submit-container">
              <button type="submit" className="submit-btn">
                Submit Application
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const FileUpload = ({ field, file, preview, onChange, onRemove, accept }) => {
  const fileInputRef = useRef();

  return (
    <div className="file-upload-container">
      {preview ? (
        <div className="file-preview">
          {preview.startsWith("data:image") ? (
            <img src={preview} alt="Preview" className="document-preview" />
          ) : (
            <div className="document-icon">
              <span>{typeof preview === "string" ? preview : file?.name}</span>
            </div>
          )}
          <div className="file-actions">
            <button type="button" onClick={() => fileInputRef.current.click()}>
              Replace
            </button>
            <button type="button" onClick={() => onRemove(field)}>
              Delete
            </button>
          </div>
        </div>
      ) : (
        <div
          className="upload-area"
          onClick={() => fileInputRef.current.click()}
        >
          <p>Upload a file (PDF or image)</p>
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => onChange(e, field)}
        accept={accept}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default PersonalInfoForm;
