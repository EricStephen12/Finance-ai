'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BanknotesIcon,
  BuildingLibraryIcon,
  CreditCardIcon,
  HomeIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  HeartIcon,
  PlusIcon,
  ArrowRightIcon,
  TruckIcon,
  ShoppingBagIcon,
  SparklesIcon,
  UserIcon,
  CurrencyDollarIcon,
  ChevronDownIcon,
  BoltIcon,
  FilmIcon,
  EnvelopeIcon,
  ArrowLeftIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import Tippy from '@tippyjs/react'

interface UserFinancialInputProps {
  isOnboarding?: boolean;
  initialData?: UserFinancialData;
  onComplete: (data: UserFinancialData) => void;
  onSkip?: () => void;
}

interface UserFinancialData {
  // Profile information
  email: string;
  fullName: string;
  country: string;
  preferredCurrency: string;
  monthlyBudget: number;
  monthlySavingsGoal: number;
  riskTolerance: 'low' | 'medium' | 'high';
  
  // Financial information
  income: {
    salary: number;
    investments: number;
    other: number;
    custom?: Record<string, number>;
  };
  expenses: {
    housing: number;
    utilities: number;
    transportation: number;
    food: number;
    healthcare: number;
    entertainment: number;
    custom?: Record<string, number>;
  };
  assets: {
    cash: number;
    stocks: number;
    bonds: number;
    realEstate: number;
    custom?: Record<string, number>;
  };
  liabilities: {
    mortgage: number;
    carLoan: number;
    studentLoans: number;
    creditCards: number;
    custom?: Record<string, number>;
  };
  goals: {
    retirement: string;
    homePurchase?: string;
    education?: string;
    travel?: string;
    custom?: Record<string, string>;
  };
}

export function UserFinancialInput({ isOnboarding = false, initialData, onComplete, onSkip }: UserFinancialInputProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<UserFinancialData>(initialData || {
    email: '',
    fullName: '',
    country: '',
    preferredCurrency: 'USD',
    monthlyBudget: 0,
    monthlySavingsGoal: 0,
    riskTolerance: 'medium',
    income: { salary: 0, investments: 0, other: 0 },
    expenses: {
      housing: 0,
      utilities: 0,
      transportation: 0,
      food: 0,
      healthcare: 0,
      entertainment: 0
    },
    assets: {
      cash: 0,
      stocks: 0,
      bonds: 0,
      realEstate: 0
    },
    liabilities: {
      mortgage: 0,
      carLoan: 0,
      studentLoans: 0,
      creditCards: 0
    },
    goals: {
      retirement: ''
    }
  });

  const steps = [
    'Profile',
    'Income',
    'Expenses', 
    'Assets',
    'Liabilities',
    'Goals'
  ];

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      onComplete(data);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-100">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 flex items-center gap-2">
          {isOnboarding ? (
            <>
              <SparklesIcon className="h-6 w-6 text-primary-500" />
              Welcome! Let's set up your profile
            </>
          ) : (
            <>
              <UserIcon className="h-6 w-6 text-primary-500" />
              Update Your Information
            </>
          )}
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          {isOnboarding 
            ? "I'll guide you through setting up your profile and financial information to provide personalized assistance."
            : "Update your profile and financial information to keep getting the most relevant advice."}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="relative bg-white px-4 sm:px-6 py-4">
        <div className="relative overflow-x-auto scrollbar-hide">
          <div className="flex items-center min-w-max px-2">
          {steps.map((stepName, index) => (
            <div
              key={stepName}
                className="flex items-center"
              >
                <div className="flex items-center">
                  <div
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center
                      transition-all duration-300 ease-in-out
                      ${index + 1 === step
                        ? 'bg-primary-100 border-2 border-primary-500 text-primary-600'
                  : index + 1 < step
                        ? 'bg-green-100 border-2 border-green-500 text-green-600'
                        : 'bg-gray-100 border-2 border-gray-300 text-gray-500'
                      }
                    `}
                  >
                    {index + 1 < step ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-900">{stepName}</span>
              </div>
              {index < steps.length - 1 && (
                  <div className="mx-3 w-8 sm:w-12">
                    <div className="h-[1px] bg-gray-200">
                      <div
                        className={`h-full transition-all duration-300 ease-in-out ${
                          index + 1 < step ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                        style={{
                          width: index + 1 < step ? '100%' : '0%'
                        }}
                      />
                    </div>
                  </div>
              )}
            </div>
          ))}
        </div>
      </div>

        {/* Mobile Step Indicator */}
        <div className="mt-3 text-center text-sm font-medium text-gray-600 sm:hidden">
          <span className="bg-gray-100 px-3 py-1 rounded-full">
            Step {step} of {steps.length}: {steps[step - 1]}
          </span>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4 sm:p-6">
        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="sm:col-span-2">
              <label className="form-label">Email</label>
              <div className="mt-1 relative">
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                  className="form-input pl-10"
                  placeholder="your.email@example.com"
              />
                <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="form-label">Full Name</label>
              <div className="mt-1 relative">
              <input
                type="text"
                value={data.fullName}
                onChange={(e) => setData({ ...data, fullName: e.target.value })}
                  className="form-input pl-10"
                  placeholder="John Doe"
              />
                <UserIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="form-label">Country</label>
              <div className="mt-1 relative">
                <select
                value={data.country}
                onChange={(e) => setData({ ...data, country: e.target.value })}
                  className="form-select w-full rounded-lg border-gray-300 shadow-sm pl-10 pr-10 py-2 text-sm focus:border-primary-500 focus:ring-primary-500 bg-white appearance-none !bg-none"
                  style={{ backgroundImage: 'none' }}
                >
                  <option value="">Select a country</option>
                  <option value="Afghanistan">Afghanistan</option>
                  <option value="Albania">Albania</option>
                  <option value="Algeria">Algeria</option>
                  <option value="Andorra">Andorra</option>
                  <option value="Angola">Angola</option>
                  <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                  <option value="Argentina">Argentina</option>
                  <option value="Armenia">Armenia</option>
                  <option value="Australia">Australia</option>
                  <option value="Austria">Austria</option>
                  <option value="Azerbaijan">Azerbaijan</option>
                  <option value="Bahamas">Bahamas</option>
                  <option value="Bahrain">Bahrain</option>
                  <option value="Bangladesh">Bangladesh</option>
                  <option value="Barbados">Barbados</option>
                  <option value="Belarus">Belarus</option>
                  <option value="Belgium">Belgium</option>
                  <option value="Belize">Belize</option>
                  <option value="Benin">Benin</option>
                  <option value="Bhutan">Bhutan</option>
                  <option value="Bolivia">Bolivia</option>
                  <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                  <option value="Botswana">Botswana</option>
                  <option value="Brazil">Brazil</option>
                  <option value="Brunei">Brunei</option>
                  <option value="Bulgaria">Bulgaria</option>
                  <option value="Burkina Faso">Burkina Faso</option>
                  <option value="Burundi">Burundi</option>
                  <option value="Cabo Verde">Cabo Verde</option>
                  <option value="Cambodia">Cambodia</option>
                  <option value="Cameroon">Cameroon</option>
                  <option value="Canada">Canada</option>
                  <option value="Central African Republic">Central African Republic</option>
                  <option value="Chad">Chad</option>
                  <option value="Chile">Chile</option>
                  <option value="China">China</option>
                  <option value="Colombia">Colombia</option>
                  <option value="Comoros">Comoros</option>
                  <option value="Congo">Congo</option>
                  <option value="Costa Rica">Costa Rica</option>
                  <option value="Croatia">Croatia</option>
                  <option value="Cuba">Cuba</option>
                  <option value="Cyprus">Cyprus</option>
                  <option value="Czech Republic">Czech Republic</option>
                  <option value="Denmark">Denmark</option>
                  <option value="Djibouti">Djibouti</option>
                  <option value="Dominica">Dominica</option>
                  <option value="Dominican Republic">Dominican Republic</option>
                  <option value="Ecuador">Ecuador</option>
                  <option value="Egypt">Egypt</option>
                  <option value="El Salvador">El Salvador</option>
                  <option value="Equatorial Guinea">Equatorial Guinea</option>
                  <option value="Eritrea">Eritrea</option>
                  <option value="Estonia">Estonia</option>
                  <option value="Eswatini">Eswatini</option>
                  <option value="Ethiopia">Ethiopia</option>
                  <option value="Fiji">Fiji</option>
                  <option value="Finland">Finland</option>
                  <option value="France">France</option>
                  <option value="Gabon">Gabon</option>
                  <option value="Gambia">Gambia</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Germany">Germany</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Greece">Greece</option>
                  <option value="Grenada">Grenada</option>
                  <option value="Guatemala">Guatemala</option>
                  <option value="Guinea">Guinea</option>
                  <option value="Guinea-Bissau">Guinea-Bissau</option>
                  <option value="Guyana">Guyana</option>
                  <option value="Haiti">Haiti</option>
                  <option value="Honduras">Honduras</option>
                  <option value="Hungary">Hungary</option>
                  <option value="Iceland">Iceland</option>
                  <option value="India">India</option>
                  <option value="Indonesia">Indonesia</option>
                  <option value="Iran">Iran</option>
                  <option value="Iraq">Iraq</option>
                  <option value="Ireland">Ireland</option>
                  <option value="Israel">Israel</option>
                  <option value="Italy">Italy</option>
                  <option value="Jamaica">Jamaica</option>
                  <option value="Japan">Japan</option>
                  <option value="Jordan">Jordan</option>
                  <option value="Kazakhstan">Kazakhstan</option>
                  <option value="Kenya">Kenya</option>
                  <option value="Kiribati">Kiribati</option>
                  <option value="Korea, North">Korea, North</option>
                  <option value="Korea, South">Korea, South</option>
                  <option value="Kosovo">Kosovo</option>
                  <option value="Kuwait">Kuwait</option>
                  <option value="Kyrgyzstan">Kyrgyzstan</option>
                  <option value="Laos">Laos</option>
                  <option value="Latvia">Latvia</option>
                  <option value="Lebanon">Lebanon</option>
                  <option value="Lesotho">Lesotho</option>
                  <option value="Liberia">Liberia</option>
                  <option value="Libya">Libya</option>
                  <option value="Liechtenstein">Liechtenstein</option>
                  <option value="Lithuania">Lithuania</option>
                  <option value="Luxembourg">Luxembourg</option>
                  <option value="Madagascar">Madagascar</option>
                  <option value="Malawi">Malawi</option>
                  <option value="Malaysia">Malaysia</option>
                  <option value="Maldives">Maldives</option>
                  <option value="Mali">Mali</option>
                  <option value="Malta">Malta</option>
                  <option value="Marshall Islands">Marshall Islands</option>
                  <option value="Mauritania">Mauritania</option>
                  <option value="Mauritius">Mauritius</option>
                  <option value="Mexico">Mexico</option>
                  <option value="Micronesia">Micronesia</option>
                  <option value="Moldova">Moldova</option>
                  <option value="Monaco">Monaco</option>
                  <option value="Mongolia">Mongolia</option>
                  <option value="Montenegro">Montenegro</option>
                  <option value="Morocco">Morocco</option>
                  <option value="Mozambique">Mozambique</option>
                  <option value="Myanmar">Myanmar</option>
                  <option value="Namibia">Namibia</option>
                  <option value="Nauru">Nauru</option>
                  <option value="Nepal">Nepal</option>
                  <option value="Netherlands">Netherlands</option>
                  <option value="New Zealand">New Zealand</option>
                  <option value="Nicaragua">Nicaragua</option>
                  <option value="Niger">Niger</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="North Macedonia">North Macedonia</option>
                  <option value="Norway">Norway</option>
                  <option value="Oman">Oman</option>
                  <option value="Pakistan">Pakistan</option>
                  <option value="Palau">Palau</option>
                  <option value="Palestine">Palestine</option>
                  <option value="Panama">Panama</option>
                  <option value="Papua New Guinea">Papua New Guinea</option>
                  <option value="Paraguay">Paraguay</option>
                  <option value="Peru">Peru</option>
                  <option value="Philippines">Philippines</option>
                  <option value="Poland">Poland</option>
                  <option value="Portugal">Portugal</option>
                  <option value="Qatar">Qatar</option>
                  <option value="Romania">Romania</option>
                  <option value="Russia">Russia</option>
                  <option value="Rwanda">Rwanda</option>
                  <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                  <option value="Saint Lucia">Saint Lucia</option>
                  <option value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</option>
                  <option value="Samoa">Samoa</option>
                  <option value="San Marino">San Marino</option>
                  <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                  <option value="Saudi Arabia">Saudi Arabia</option>
                  <option value="Senegal">Senegal</option>
                  <option value="Serbia">Serbia</option>
                  <option value="Seychelles">Seychelles</option>
                  <option value="Sierra Leone">Sierra Leone</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Slovakia">Slovakia</option>
                  <option value="Slovenia">Slovenia</option>
                  <option value="Solomon Islands">Solomon Islands</option>
                  <option value="Somalia">Somalia</option>
                  <option value="South Africa">South Africa</option>
                  <option value="South Sudan">South Sudan</option>
                  <option value="Spain">Spain</option>
                  <option value="Sri Lanka">Sri Lanka</option>
                  <option value="Sudan">Sudan</option>
                  <option value="Suriname">Suriname</option>
                  <option value="Sweden">Sweden</option>
                  <option value="Switzerland">Switzerland</option>
                  <option value="Syria">Syria</option>
                  <option value="Taiwan">Taiwan</option>
                  <option value="Tajikistan">Tajikistan</option>
                  <option value="Tanzania">Tanzania</option>
                  <option value="Thailand">Thailand</option>
                  <option value="Timor-Leste">Timor-Leste</option>
                  <option value="Togo">Togo</option>
                  <option value="Tonga">Tonga</option>
                  <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                  <option value="Tunisia">Tunisia</option>
                  <option value="Turkey">Turkey</option>
                  <option value="Turkmenistan">Turkmenistan</option>
                  <option value="Tuvalu">Tuvalu</option>
                  <option value="Uganda">Uganda</option>
                  <option value="Ukraine">Ukraine</option>
                  <option value="United Arab Emirates">United Arab Emirates</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States">United States</option>
                  <option value="Uruguay">Uruguay</option>
                  <option value="Uzbekistan">Uzbekistan</option>
                  <option value="Vanuatu">Vanuatu</option>
                  <option value="Vatican City">Vatican City</option>
                  <option value="Venezuela">Venezuela</option>
                  <option value="Vietnam">Vietnam</option>
                  <option value="Yemen">Yemen</option>
                  <option value="Zambia">Zambia</option>
                  <option value="Zimbabwe">Zimbabwe</option>
                </select>
                <UserIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <ChevronDownIcon className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="form-label">Preferred Currency</label>
              <div className="mt-1 relative">
              <select
                value={data.preferredCurrency}
                onChange={(e) => setData({ ...data, preferredCurrency: e.target.value })}
                  className="form-select w-full rounded-lg border-gray-300 shadow-sm pl-10 pr-10 py-2 text-sm focus:border-primary-500 focus:ring-primary-500 bg-white appearance-none !bg-none"
                  style={{ backgroundImage: 'none' }}
                >
                  <option value="">Select a currency</option>
                  <option value="AED">AED - UAE Dirham</option>
                  <option value="AFN">AFN - Afghan Afghani</option>
                  <option value="ALL">ALL - Albanian Lek</option>
                  <option value="AMD">AMD - Armenian Dram</option>
                  <option value="ANG">ANG - Netherlands Antillean Guilder</option>
                  <option value="AOA">AOA - Angolan Kwanza</option>
                  <option value="ARS">ARS - Argentine Peso</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                  <option value="AWG">AWG - Aruban Florin</option>
                  <option value="AZN">AZN - Azerbaijani Manat</option>
                  <option value="BAM">BAM - Bosnia-Herzegovina Convertible Mark</option>
                  <option value="BBD">BBD - Barbadian Dollar</option>
                  <option value="BDT">BDT - Bangladeshi Taka</option>
                  <option value="BGN">BGN - Bulgarian Lev</option>
                  <option value="BHD">BHD - Bahraini Dinar</option>
                  <option value="BIF">BIF - Burundian Franc</option>
                  <option value="BMD">BMD - Bermudan Dollar</option>
                  <option value="BND">BND - Brunei Dollar</option>
                  <option value="BOB">BOB - Bolivian Boliviano</option>
                  <option value="BRL">BRL - Brazilian Real</option>
                  <option value="BSD">BSD - Bahamian Dollar</option>
                  <option value="BTN">BTN - Bhutanese Ngultrum</option>
                  <option value="BWP">BWP - Botswanan Pula</option>
                  <option value="BYN">BYN - Belarusian Ruble</option>
                  <option value="BZD">BZD - Belize Dollar</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="CDF">CDF - Congolese Franc</option>
                  <option value="CHF">CHF - Swiss Franc</option>
                  <option value="CLP">CLP - Chilean Peso</option>
                  <option value="CNY">CNY - Chinese Yuan</option>
                  <option value="COP">COP - Colombian Peso</option>
                  <option value="CRC">CRC - Costa Rican Colón</option>
                  <option value="CUP">CUP - Cuban Peso</option>
                  <option value="CVE">CVE - Cape Verdean Escudo</option>
                  <option value="CZK">CZK - Czech Republic Koruna</option>
                  <option value="DJF">DJF - Djiboutian Franc</option>
                  <option value="DKK">DKK - Danish Krone</option>
                  <option value="DOP">DOP - Dominican Peso</option>
                  <option value="DZD">DZD - Algerian Dinar</option>
                  <option value="EGP">EGP - Egyptian Pound</option>
                  <option value="ERN">ERN - Eritrean Nakfa</option>
                  <option value="ETB">ETB - Ethiopian Birr</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="FJD">FJD - Fijian Dollar</option>
                  <option value="FKP">FKP - Falkland Islands Pound</option>
                  <option value="GBP">GBP - British Pound Sterling</option>
                  <option value="GEL">GEL - Georgian Lari</option>
                  <option value="GHS">GHS - Ghanaian Cedi</option>
                  <option value="GIP">GIP - Gibraltar Pound</option>
                  <option value="GMD">GMD - Gambian Dalasi</option>
                  <option value="GNF">GNF - Guinean Franc</option>
                  <option value="GTQ">GTQ - Guatemalan Quetzal</option>
                  <option value="GYD">GYD - Guyanaese Dollar</option>
                  <option value="HKD">HKD - Hong Kong Dollar</option>
                  <option value="HNL">HNL - Honduran Lempira</option>
                  <option value="HRK">HRK - Croatian Kuna</option>
                  <option value="HTG">HTG - Haitian Gourde</option>
                  <option value="HUF">HUF - Hungarian Forint</option>
                  <option value="IDR">IDR - Indonesian Rupiah</option>
                  <option value="ILS">ILS - Israeli New Sheqel</option>
                  <option value="INR">INR - Indian Rupee</option>
                  <option value="IQD">IQD - Iraqi Dinar</option>
                  <option value="IRR">IRR - Iranian Rial</option>
                  <option value="ISK">ISK - Icelandic Króna</option>
                  <option value="JMD">JMD - Jamaican Dollar</option>
                  <option value="JOD">JOD - Jordanian Dinar</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                  <option value="KES">KES - Kenyan Shilling</option>
                  <option value="KGS">KGS - Kyrgystani Som</option>
                  <option value="KHR">KHR - Cambodian Riel</option>
                  <option value="KMF">KMF - Comorian Franc</option>
                  <option value="KPW">KPW - North Korean Won</option>
                  <option value="KRW">KRW - South Korean Won</option>
                  <option value="KWD">KWD - Kuwaiti Dinar</option>
                  <option value="KYD">KYD - Cayman Islands Dollar</option>
                  <option value="KZT">KZT - Kazakhstani Tenge</option>
                  <option value="LAK">LAK - Laotian Kip</option>
                  <option value="LBP">LBP - Lebanese Pound</option>
                  <option value="LKR">LKR - Sri Lankan Rupee</option>
                  <option value="LRD">LRD - Liberian Dollar</option>
                  <option value="LSL">LSL - Lesotho Loti</option>
                  <option value="LYD">LYD - Libyan Dinar</option>
                  <option value="MAD">MAD - Moroccan Dirham</option>
                  <option value="MDL">MDL - Moldovan Leu</option>
                  <option value="MGA">MGA - Malagasy Ariary</option>
                  <option value="MKD">MKD - Macedonian Denar</option>
                  <option value="MMK">MMK - Myanma Kyat</option>
                  <option value="MNT">MNT - Mongolian Tugrik</option>
                  <option value="MOP">MOP - Macanese Pataca</option>
                  <option value="MRU">MRU - Mauritanian Ouguiya</option>
                  <option value="MUR">MUR - Mauritian Rupee</option>
                  <option value="MVR">MVR - Maldivian Rufiyaa</option>
                  <option value="MWK">MWK - Malawian Kwacha</option>
                  <option value="MXN">MXN - Mexican Peso</option>
                  <option value="MYR">MYR - Malaysian Ringgit</option>
                  <option value="MZN">MZN - Mozambican Metical</option>
                  <option value="NAD">NAD - Namibian Dollar</option>
                  <option value="NGN">NGN - Nigerian Naira</option>
                  <option value="NIO">NIO - Nicaraguan Córdoba</option>
                  <option value="NOK">NOK - Norwegian Krone</option>
                  <option value="NPR">NPR - Nepalese Rupee</option>
                  <option value="NZD">NZD - New Zealand Dollar</option>
                  <option value="OMR">OMR - Omani Rial</option>
                  <option value="PAB">PAB - Panamanian Balboa</option>
                  <option value="PEN">PEN - Peruvian Nuevo Sol</option>
                  <option value="PGK">PGK - Papua New Guinean Kina</option>
                  <option value="PHP">PHP - Philippine Peso</option>
                  <option value="PKR">PKR - Pakistani Rupee</option>
                  <option value="PLN">PLN - Polish Zloty</option>
                  <option value="PYG">PYG - Paraguayan Guarani</option>
                  <option value="QAR">QAR - Qatari Rial</option>
                  <option value="RON">RON - Romanian Leu</option>
                  <option value="RSD">RSD - Serbian Dinar</option>
                  <option value="RUB">RUB - Russian Ruble</option>
                  <option value="RWF">RWF - Rwandan Franc</option>
                  <option value="SAR">SAR - Saudi Riyal</option>
                  <option value="SBD">SBD - Solomon Islands Dollar</option>
                  <option value="SCR">SCR - Seychellois Rupee</option>
                  <option value="SDG">SDG - Sudanese Pound</option>
                  <option value="SEK">SEK - Swedish Krona</option>
                  <option value="SGD">SGD - Singapore Dollar</option>
                  <option value="SHP">SHP - Saint Helena Pound</option>
                  <option value="SLL">SLL - Sierra Leonean Leone</option>
                  <option value="SOS">SOS - Somali Shilling</option>
                  <option value="SRD">SRD - Surinamese Dollar</option>
                  <option value="SSP">SSP - South Sudanese Pound</option>
                  <option value="STN">STN - São Tomé and Príncipe Dobra</option>
                  <option value="SVC">SVC - Salvadoran Colón</option>
                  <option value="SYP">SYP - Syrian Pound</option>
                  <option value="SZL">SZL - Swazi Lilangeni</option>
                  <option value="THB">THB - Thai Baht</option>
                  <option value="TJS">TJS - Tajikistani Somoni</option>
                  <option value="TMT">TMT - Turkmenistani Manat</option>
                  <option value="TND">TND - Tunisian Dinar</option>
                  <option value="TOP">TOP - Tongan Pa'anga</option>
                  <option value="TRY">TRY - Turkish Lira</option>
                  <option value="TTD">TTD - Trinidad and Tobago Dollar</option>
                  <option value="TWD">TWD - New Taiwan Dollar</option>
                  <option value="TZS">TZS - Tanzanian Shilling</option>
                  <option value="UAH">UAH - Ukrainian Hryvnia</option>
                  <option value="UGX">UGX - Ugandan Shilling</option>
                  <option value="USD">USD - United States Dollar</option>
                  <option value="UYU">UYU - Uruguayan Peso</option>
                  <option value="UZS">UZS - Uzbekistan Som</option>
                  <option value="VES">VES - Venezuelan Bolívar</option>
                  <option value="VND">VND - Vietnamese Dong</option>
                  <option value="VUV">VUV - Vanuatu Vatu</option>
                  <option value="WST">WST - Samoan Tala</option>
                  <option value="XAF">XAF - CFA Franc BEAC</option>
                  <option value="XCD">XCD - East Caribbean Dollar</option>
                  <option value="XOF">XOF - CFA Franc BCEAO</option>
                  <option value="XPF">XPF - CFP Franc</option>
                  <option value="YER">YER - Yemeni Rial</option>
                  <option value="ZAR">ZAR - South African Rand</option>
                  <option value="ZMW">ZMW - Zambian Kwacha</option>
                  <option value="ZWL">ZWL - Zimbabwean Dollar</option>
              </select>
                <CurrencyDollarIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <ChevronDownIcon className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="form-label">Monthly Budget</label>
              <div className="mt-1 relative">
              <input
                type="number"
                value={data.monthlyBudget}
                onChange={(e) => setData({ ...data, monthlyBudget: Number(e.target.value) })}
                  className="form-input pl-10"
                  placeholder="5000"
              />
                <BriefcaseIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="form-label">Monthly Savings Goal</label>
              <div className="mt-1 relative">
              <input
                type="number"
                value={data.monthlySavingsGoal}
                onChange={(e) => setData({ ...data, monthlySavingsGoal: Number(e.target.value) })}
                  className="form-input pl-10"
                  placeholder="1000"
              />
                <BanknotesIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="form-label">Risk Tolerance</label>
              <div className="mt-1">
              <select
                value={data.riskTolerance}
                onChange={(e) => setData({ ...data, riskTolerance: e.target.value as 'low' | 'medium' | 'high' })}
                  className="form-input pl-10"
              >
                <option value="low">Low - I prefer stable, low-risk investments</option>
                <option value="medium">Medium - I can handle some market fluctuations</option>
                <option value="high">High - I'm comfortable with significant market volatility</option>
              </select>
                <ChartBarIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <BanknotesIcon className="h-5 w-5 text-primary-500" />
              Income Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
                <label className="form-label">Salary</label>
                <div className="mt-1 relative">
              <input
                type="number"
                value={data.income.salary}
                onChange={(e) => setData({
                  ...data,
                  income: { ...data.income, salary: Number(e.target.value) }
                })}
                    className="form-input pl-10"
                    placeholder="0"
              />
                  <BriefcaseIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
            </div>
            <div>
                <label className="form-label">Investment Income</label>
                <div className="mt-1 relative">
              <input
                type="number"
                value={data.income.investments}
                onChange={(e) => setData({
                  ...data,
                  income: { ...data.income, investments: Number(e.target.value) }
                })}
                    className="form-input pl-10"
                    placeholder="0"
              />
                  <ChartBarIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
            </div>
              <div className="sm:col-span-2">
                <label className="form-label">Other Income</label>
                <div className="mt-1 relative">
              <input
                type="number"
                value={data.income.other}
                onChange={(e) => setData({
                  ...data,
                  income: { ...data.income, other: Number(e.target.value) }
                })}
                    className="form-input pl-10"
                    placeholder="0"
              />
                  <PlusIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <CreditCardIcon className="h-5 w-5 text-primary-500" />
              Monthly Expenses
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
                <label className="form-label">Housing</label>
                <div className="mt-1 relative">
              <input
                type="number"
                value={data.expenses.housing}
                onChange={(e) => setData({
                  ...data,
                  expenses: { ...data.expenses, housing: Number(e.target.value) }
                })}
                    className="form-input pl-10"
                    placeholder="0"
              />
                  <HomeIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
            </div>
            <div>
                <label className="form-label">Utilities</label>
                <div className="mt-1 relative">
              <input
                type="number"
                value={data.expenses.utilities}
                onChange={(e) => setData({
                  ...data,
                  expenses: { ...data.expenses, utilities: Number(e.target.value) }
                })}
                    className="form-input pl-10"
                    placeholder="0"
              />
                  <BoltIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
            </div>
            <div>
                <label className="form-label">Transportation</label>
                <div className="mt-1 relative">
              <input
                type="number"
                value={data.expenses.transportation}
                onChange={(e) => setData({
                  ...data,
                  expenses: { ...data.expenses, transportation: Number(e.target.value) }
                })}
                    className="form-input pl-10"
                    placeholder="0"
              />
                  <TruckIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
            </div>
            <div>
                <label className="form-label">Food</label>
                <div className="mt-1 relative">
              <input
                type="number"
                value={data.expenses.food}
                onChange={(e) => setData({
                  ...data,
                  expenses: { ...data.expenses, food: Number(e.target.value) }
                })}
                    className="form-input pl-10"
                    placeholder="0"
              />
                  <ShoppingBagIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
            </div>
            <div>
                <label className="form-label">Healthcare</label>
                <div className="mt-1 relative">
              <input
                type="number"
                value={data.expenses.healthcare}
                onChange={(e) => setData({
                  ...data,
                  expenses: { ...data.expenses, healthcare: Number(e.target.value) }
                })}
                    className="form-input pl-10"
                    placeholder="0"
              />
                  <HeartIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
            </div>
            <div>
                <label className="form-label">Entertainment</label>
                <div className="mt-1 relative">
              <input
                type="number"
                value={data.expenses.entertainment}
                onChange={(e) => setData({
                  ...data,
                  expenses: { ...data.expenses, entertainment: Number(e.target.value) }
                })}
                    className="form-input pl-10"
                    placeholder="0"
              />
                  <FilmIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Assets</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cash & Savings</label>
              <input
                type="number"
                value={data.assets.cash}
                onChange={(e) => setData({
                  ...data,
                  assets: { ...data.assets, cash: Number(e.target.value) }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Stocks</label>
              <input
                type="number"
                value={data.assets.stocks}
                onChange={(e) => setData({
                  ...data,
                  assets: { ...data.assets, stocks: Number(e.target.value) }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bonds</label>
              <input
                type="number"
                value={data.assets.bonds}
                onChange={(e) => setData({
                  ...data,
                  assets: { ...data.assets, bonds: Number(e.target.value) }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Real Estate</label>
              <input
                type="number"
                value={data.assets.realEstate}
                onChange={(e) => setData({
                  ...data,
                  assets: { ...data.assets, realEstate: Number(e.target.value) }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Liabilities</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mortgage</label>
              <input
                type="number"
                value={data.liabilities.mortgage}
                onChange={(e) => setData({
                  ...data,
                  liabilities: { ...data.liabilities, mortgage: Number(e.target.value) }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Car Loan</label>
              <input
                type="number"
                value={data.liabilities.carLoan}
                onChange={(e) => setData({
                  ...data,
                  liabilities: { ...data.liabilities, carLoan: Number(e.target.value) }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Student Loans</label>
              <input
                type="number"
                value={data.liabilities.studentLoans}
                onChange={(e) => setData({
                  ...data,
                  liabilities: { ...data.liabilities, studentLoans: Number(e.target.value) }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Credit Cards</label>
              <input
                type="number"
                value={data.liabilities.creditCards}
                onChange={(e) => setData({
                  ...data,
                  liabilities: { ...data.liabilities, creditCards: Number(e.target.value) }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Financial Goals</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">Retirement Goal</label>
              <input
                type="text"
                value={data.goals.retirement}
                onChange={(e) => setData({
                  ...data,
                  goals: { ...data.goals, retirement: e.target.value }
                })}
                placeholder="e.g., Save $2M by age 65"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Home Purchase Goal</label>
              <input
                type="text"
                value={data.goals.homePurchase || ''}
                onChange={(e) => setData({
                  ...data,
                  goals: { ...data.goals, homePurchase: e.target.value }
                })}
                placeholder="e.g., Buy a $500k home in 5 years"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Education Goal</label>
              <input
                type="text"
                value={data.goals.education || ''}
                onChange={(e) => setData({
                  ...data,
                  goals: { ...data.goals, education: e.target.value }
                })}
                placeholder="e.g., Save $100k for children's education"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Travel Goal</label>
              <input
                type="text"
                value={data.goals.travel || ''}
                onChange={(e) => setData({
                  ...data,
                  goals: { ...data.goals, travel: e.target.value }
                })}
                placeholder="e.g., Save $10k for annual vacations"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-lg flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={step === 1}
          className={`
            px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all
            ${step === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }
          `}
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Previous
        </button>
        <div className="flex items-center gap-3">
          {isOnboarding && (
            <button
              onClick={handleSkip}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
            >
              Skip for now
            </button>
          )}
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center gap-2 text-sm font-medium transition-all"
          >
            {step === steps.length ? 'Complete' : 'Next'}
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
} 