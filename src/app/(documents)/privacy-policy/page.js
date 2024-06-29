import React from 'react';
import styles from '../../components/styles/Terms.module.css';

export default function PrivacyPolicy() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Privacy Policy</h1>
      <p className={styles.text}>This privacy notice explains what to expect us to do with your personal information when you use the EggPal application.</p>
      
      <h2 className={styles.subheading}>Our Contact Details</h2>
      <a href="mailto:support@eggpal.net" className={styles.link}>support@eggpal.net</a>
      
      <h2 className={styles.subheading}>What Information We Collect, Use, and Why</h2>
      <p className={styles.text}>We collect and use the following information for the operation of customer accounts and guarantees:</p>
      <ul>
        <li className={styles.text}>Account information, including registration details (such as email addresses and passwords).</li>
      </ul>
      
      <h2 className={styles.subheading}>Lawful Bases</h2>
      <p className={styles.text}>Our lawful bases for collecting or using personal information for the operation of customer accounts and guarantees are:</p>
      <ul>
        <li className={styles.text}><strong>Contract:</strong> We collect and use this information to enter into and carry out our contract with you.</li>
        <li className={styles.text}><strong>Legitimate Interest:</strong>
          <ul>
            <li className={styles.text}><strong>Security and Fraud Prevention:</strong> Collecting personal information such as email addresses and passwords allows us to authenticate users, protect their accounts from unauthorized access, and prevent fraudulent activities. This is crucial for maintaining the integrity and security of our web application, thereby safeguarding user data and ensuring a trustworthy environment.</li>
            <li className={styles.text}><strong>User Experience and Support:</strong> By maintaining accurate user accounts, we can provide personalised and efficient customer service. This includes helping users with account-related issues, providing relevant updates, and ensuring they can access the services they signed up for without interruption. This enhances the overall user experience and satisfaction.</li>
            <li className={styles.text}><strong>Operational Efficiency:</strong> Proper management of user accounts enables us to streamline our operations, manage resources effectively, and improve our services. This includes ensuring that our system can handle user data efficiently and that we can scale our services as our user base grows.</li>
          </ul>
        </li>
      </ul>
      
      <h2 className={styles.subheading}>Where We Get Personal Information From</h2>
      <p className={styles.text}>We collect personal information directly from users during the registration process and through their interactions with our application.</p>
      
      <h2 className={styles.subheading}>How Long We Keep Information</h2>
      <p className={styles.text}>We retain personal information for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements. Specifically:</p>
      <ul>
        <li className={styles.text}><strong>Account Information:</strong> Retained for the duration of the accounts existence. If an account is deleted, the associated data will be retained for up to 6 months to allow for account recovery and to comply with legal obligations.</li>
        <li className={styles.text}><strong>Customer Support Records:</strong> Retained for 2 years from the date of the last interaction to help resolve any future issues or disputes.</li>
        <li className={styles.text}><strong>Marketing Data (if applicable):</strong> Retained until the user opts out of marketing communications or withdraws consent.</li>
        <li className={styles.text}><strong>Legal Compliance Data:</strong> Retained as long as required by law.</li>
      </ul>
      <p className={styles.text}>After these periods, we will securely delete or anonymize personal information. If deletion is not possible (for example, because the personal information has been stored in backup archives), then we will securely store and isolate the personal information from any further processing until deletion is possible.</p>
      
      <h2 className={styles.subheading}>Your Data Protection Rights</h2>
      <p className={styles.text}>Under data protection law, you have rights including:</p>
      <ul>
        <li className={styles.text}><strong>Your right of access:</strong> You have the right to ask us for copies of your personal data.</li>
        <li className={styles.text}><strong>Your right to rectification:</strong> You have the right to ask us to rectify personal data you think is inaccurate. You also have the right to ask us to complete information you think is incomplete.</li>
        <li className={styles.text}><strong>Your right to erasure:</strong> You have the right to ask us to erase your personal data in certain circumstances.</li>
        <li className={styles.text}><strong>Your right to restriction of processing:</strong> You have the right to ask us to restrict the processing of your personal data in certain circumstances.</li>
        <li className={styles.text}><strong>Your right to object to processing:</strong> You have the right to object to the processing of your personal data in certain circumstances.</li>
        <li className={styles.text}><strong>Your right to data portability:</strong> You have the right to ask that we transfer the personal data you gave us to another organization, or to you, in certain circumstances.</li>
        <li className={styles.text}><strong>Your right to withdraw consent:</strong> When we use consent as our lawful basis, you have the right to withdraw your consent at any time.</li>
      </ul>
      <p className={styles.text}>You don’t usually need to pay a fee to exercise your rights. If you make a request, we have one calendar month to respond to you. To make a data protection rights request, please contact us using the contact details at the top of this privacy notice.</p>
      
      <h2 className={styles.subheading}>How to Complain</h2>
      <p className={styles.text}>If you have any concerns about our use of your personal data, you can make a complaint to us using the contact details at the top of this privacy notice.</p>
      <p className={styles.text}>If you remain unhappy with how we’ve used your data after raising a complaint with us, you can also complain to the ICO.</p>
      <p className={styles.text}>The ICO’s address:</p>
      <p className={styles.text}>Information Commissioner’s Office<br />
      Wycliffe House<br />
      Water Lane<br />
      Wilmslow<br />
      Cheshire<br />
      SK9 5AF</p>
      <p className={styles.text}>Helpline number: 0303 123 1113</p>
      <p className={styles.text}>Website: <a href="https://www.ico.org.uk/make-a-complaint" className={styles.link}>https://www.ico.org.uk/make-a-complaint</a></p>
      
      <p className={styles.text}>Last Updated: 26 May 2024</p>
    </div>
  );
};

PrivacyPolicy.displayName = 'PrivacyPolicy'