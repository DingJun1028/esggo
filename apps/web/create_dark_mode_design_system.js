// create_dark_mode_design_system.js
import { stitch } from "@google/stitch-sdk";

async function createDesignSystem() {
  try {
    console.log("STITCH_API_KEY from process.env:", process.env.STITCH_API_KEY);

    if (!process.env.STITCH_API_KEY) {
        console.error("STITCH_API_KEY environment variable is not set. Please set it before running the script.");
        return;
    }

    console.log("Attempting to create a new Stitch project to verify SDK usage...");
    // Assuming stitch.createProject exists and returns a project object
    const newProject = await stitch.createProject("Temporary Project for Design System Creation");
    console.log("Temporary project created successfully:", newProject);

    // Now, let's try to list projects, assuming the `stitch` object is the entry point for all top-level operations.
    // If this fails, then `listProjects` is likely not directly on the `stitch` singleton.
    console.log("Listing Stitch projects to verify object methods...");
    const projects = await stitch.listProjects();
    console.log("Stitch projects listed successfully:", projects);


    const designSystemConfig = {
      displayName: "ESGGO Cyan Sovereignty Dark",
      theme: {
        bodyFont: "JETBRAINS_MONO",
        colorMode: "DARK",
        customColor: "#06B6D4",
        headlineFont: "INTER",
        roundness: "ROUND_TWELVE"
      }
    };

    console.log("Creating Dark Mode Design System...");
    const createdDesignSystem = await stitch.createDesignSystem(designSystemConfig, { projectId: newProject.id }); // Use the newly created project ID
    console.log("Dark Mode Design System created successfully:", createdDesignSystem);

  } catch (error) {
    console.error("Error in creating Design System:", error);
    console.error(error);
  }
}

createDesignSystem();
