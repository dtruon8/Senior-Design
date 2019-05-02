# Senior-Design
AAC Diagnostic Tool

The web app can be accessed only on the LSU wifi at capstone.ece.lsu.edu due to the server only being hosted by LSU. 

Currently, the web application is using the code in the 'pub' folder. This includes the home, assessment, and assessment summary page. Tentatively, the web app was going to have the login, registration, and password recovery features, but due to time constraints and a bad team composition, we failed in our endeavors. Also, we had the idea of creating an algorithm for assigning a patient to an AAC device from the selected assessment answers, but that also did not work out. For next year's LSU Senior Design Class, we would like this project to flourish and be the best it could be to help Speech-Language Pathologists in the diagnostic process for assigning an appropriate AAC device for their patients. Below is the user manual for the web app. 

## User Manual

### Home Page:
<img src="/images/home.PNG" alt="Home Page" width=350>

Here, the user can either begin a new AAC assessment or upload a previously-saved file to resume an assessment. If the user uploads an invalid file, an error message is displayed in red. Clicking the *Start AAC Assessment* button brings the user to the **AAC Assessment Page.**

### AAC Assessment Page:
<img src="/images/assessment.PNG" alt="Assessment Page" width=500>

In the middle of this page is the AAC assessment. There are six required sections, with the **Comments** section being optional. The user can select a section using the buttons at the left, and the current section's questions appear to the right. As questions are answered, the progress bar under the section name fills. Once all required questions in a section are answered, a checkmark appears next to the section name at the left. The types of questions include radio buttons, checkboxes, dropdown/select, and text input. In addition, some questions are not required unless a particular answer is chosen to a previous question. Once all required questions across each section has been answered, the *Submit* button at the bottom becomes clickable, allowing the user to access the **Summary Page.**

In addition to the assessment, there is a timer on the page, showing the time that has elapsed since the assessment began. The timer can be paused and resumed using the buttons below it. There is a *Save* button, allowing the user to save a text file that contains the input text and IDs of the answered questions. The user can upload this file on the **Home Page** to continue from where they left off. Note that on mobile devices (or iOS devices, at least), the process of saving the file is different. It is detailed below in the [Additional Notes](#additional-notes) section.

### AAC Assessment Summary Page:
<img src="/images/summary.PNG" alt="Summary Page" width=350>

On this page, the user can save a PDF summary of the selected answers and their input text answers by clicking the *Save Assessment Summary* button. The user can also return to the **Home Page** by clicking the *Home* button.

## Technical Details

## Modifying the Assessment

## Additional Notes
### Saving Assessment Progress Text File on Mobile Devices
On mobile devices (or maybe just Apple devices? We couldn't test on other mobile devices), the procedure for saving the text file is:
    1. On the assessment page, click "Save" at the top right.
    2. You will be brought to a page containing the text from the file.
	  3. Highlight all of the text.
	  4. Click "Share..."
	  5. Save the file to the desired location. The easiest way would be to click "Save to Files" and save it to iCloud Drive.
The procedure for resuming an assessment:
	  1. On the Home Page, click the file upload button ("Choose File" on Apple devices). 
	  2. Click "Browse" and browse to the location where a saved assessment text file is.
	  3. Choose the desired file.
	  4. Click "Start AAC Assessment" button
	
### Known Issues
	- In the summary PDF, if the first line on a new page is an answer it is aligned to the left of the page rather than the proper alignment.
	- On iOS devices, the table headers don't stick when scrolling. This is likely due to different handling of the "position: sticky" CSS property.
	- On mobile devices (or at least iOS devices), extra steps are required to save the assessment progres to a text file. (this is an issue with those devices, not with the code)
	
