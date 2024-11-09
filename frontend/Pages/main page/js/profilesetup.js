let currentStep = 1;
const token = localStorage.getItem("token");
      
        function nextStep() {
        // Validation for Step 1
        if (currentStep === 1) {
          const weight = document.getElementById("weight").value;
          const height = document.getElementById("height").value;
          if (!weight || !height) {
            alert("Please fill out weight and height.");
            return;
          }
        }

        // Validation for Step 2
        if (currentStep === 2) {
          const experience = document.getElementById("experience").value;
          if (!experience) {
            alert("Please select your experience level.");
            return;
          }
        }

        // Validation for Step 3
        if (currentStep === 3) {
          const goal = document.getElementById("goal").value;
          const customGoal = document.getElementById("customGoal").value;
          if (!goal || (goal === "Other" && !customGoal)) {
            alert("Please select your fitness goal or specify a custom goal.");
            return;
          }
        }

        // Move to the next step
        document.getElementById(`step${currentStep}`).style.display = "none";
        currentStep++;
        document.getElementById(`step${currentStep}`).style.display = "block";
      }

      function prevStep() {
        document.getElementById(`step${currentStep}`).style.display = "none";
        currentStep--;
        document.getElementById(`step${currentStep}`).style.display = "block";
      }

      document
        .getElementById("onboardingForm")
        .addEventListener("submit", function (e) {
          e.preventDefault();

          // Collect form data
          const data = {
            weight: document.getElementById("weight").value,
            height: document.getElementById("height").value,
            experience: document.getElementById("experience").value,
            goal:
              document.getElementById("goal").value === "Other"
                ? document.getElementById("customGoal").value
                : document.getElementById("goal").value,
          };

          // Send data to the backend
          fetch("http://localhost:5000/api/user/profile", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.success) {
                localStorage.setItem("profileSetupComplete", "true");
                alert("Profile setup complete!");
                bootstrap.Modal.getInstance(
                  document.getElementById("onboardingModal")
                ).hide();
              } else {
                alert("Error: " + data.message);
              }
            })
            .catch((error) => {
              console.error("Error:", error);
              alert("An error occurred.");
            });
        });

      function toggleCustomGoal() {
        const goalSelect = document.getElementById("goal");
        const customGoalField = document.getElementById("customGoalField");
        customGoalField.style.display =
          goalSelect.value === "Other" ? "block" : "none";
      }

      function toggleProfileCustomGoal() {
        const profileGoalSelect = document.getElementById("profileGoal");
        const profileCustomGoalField = document.getElementById(
          "profileCustomGoalField"
        );
        profileCustomGoalField.style.display =
          profileGoalSelect.value === "Other" ? "block" : "none";
      }

     

      document.addEventListener("DOMContentLoaded", async () => {
        const token = localStorage.getItem("token");
    
        try {
            // Fetch profile completion status from the backend
            const response = await fetch("http://localhost:5000/api/user/profile-status", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
    
            const data = await response.json();
    
            if (response.ok && !data.profileSetupComplete) {
                // Show the profile setup modal if the profile is not complete
                const onboardingModal = new bootstrap.Modal(document.getElementById("onboardingModal"));
                onboardingModal.show();
            }
        } catch (error) {
            console.error("Error fetching profile status:", error);
        }
    });
    