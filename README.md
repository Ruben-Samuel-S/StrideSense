# StrideSense

**Smart Prosthetic Foot with Real-Time Gait Analysis and Pressure Monitoring**

---

## Overview

StrideSense is an embedded biomedical systems project that develops an intelligent prosthetic foot capable of real-time pressure and motion sensing. The system integrates force-sensitive resistors (FSR) and inertial measurement units (IMU) for comprehensive gait biomechanics analysis. Data is wirelessly transmitted to a visualization dashboard for clinical assessment and user feedback.

This project demonstrates practical application of embedded systems, sensor integration, and data visualization in assistive medical technology.

---

## Problem Statement

Traditional prosthetic limbs lack real-time feedback on plantar pressure distribution and gait kinematics, limiting:

- Clinical assessment of load distribution patterns
- User awareness of gait abnormalities
- Optimization of prosthetic fitting and training
- Prevention of pressure-related tissue damage

Current solutions either rely on external motion capture systems (expensive, lab-bound) or provide no biomechanical feedback to users.

---

## Proposed Solution

StrideSense embeds sensors directly into a prosthetic foot to provide:

- **Real-time pressure mapping** across the plantar surface using FSR sensors
- **Motion tracking** via 6-axis IMU for gait phase detection and motion analysis
- **Wireless data streaming** to enable portable, wearable operation
- **Visual analytics dashboard** for clinicians and users to monitor gait quality

The system operates independently and can be integrated with existing prosthetic designs.

---

## System Architecture

### Hardware Components

- **Microcontroller**: ESP32 (dual-core, Wi-Fi capable, ADC support)
- **Pressure Sensors**: Force-Sensitive Resistors (FSR) distributed across plantar surface
- **Motion Sensor**: MPU6050 (6-axis IMU: 3-axis accelerometer + 3-axis gyroscope)
- **Communication**: Wi-Fi protocol via ESP32 for real-time data transmission
- **Power**: Battery-powered operation with low-power optimization

### Software Stack

- **Embedded Firmware**: C/C++ (Arduino framework on ESP32)
- **Data Acquisition**: Real-time sensor polling and analog-to-digital conversion
- **Frontend Dashboard**: React + TypeScript for interactive visualization
- **UI Framework**: Tailwind CSS + shadcn-ui for responsive design
- **Build Tool**: Vite for optimized development and production builds

### Data Flow

```
[FSR Sensors] ─┐
              ├─→ [ESP32] ──→ [Wi-Fi] ──→ [Dashboard]
[MPU6050 IMU] ─┘                           (React App)
```

The ESP32 continuously samples pressure and motion data, applies basic filtering, and transmits processed data to the web dashboard. The dashboard visualizes plantar pressure heatmaps, acceleration/angular velocity plots, and gait phase indicators.

### System Workflow

1. **Sensor Reading**: ESP32 reads FSR analog values and IMU acceleration/gyroscope data at configurable sampling rates
2. **Data Preprocessing**: Calibration offsets applied; noise filtering performed
3. **Wireless Transmission**: Data streamed via Wi-Fi to the dashboard application
4. **Visualization**: Real-time plots and pressure maps rendered in React frontend
5. **Analysis**: Clinical metrics (stride time, peak pressure, stability) calculated and displayed

---

## Sample Output

### System Demonstration

![System Architecture](docs/architecture.png)

### Gait Analysis Visualization

![Pressure and Motion Output](docs/output.png)

### User Dashboard Interface

![Dashboard UI](docs/ui.png)

---

## Technology Stack

| Category | Technology |
|----------|-----------|
| **Microcontroller** | ESP32 |
| **Sensors** | FSR (Force-Sensitive Resistor), MPU6050 (6-axis IMU) |
| **Firmware** | C/C++ (Arduino) |
| **Frontend** | React, TypeScript |
| **Styling** | Tailwind CSS, shadcn-ui |
| **Build System** | Vite |
| **Protocol** | Wi-Fi (TCP/UDP) |

---

## AI Integration (In Progress)

Lovable AI was used to assist with frontend development and UI prototyping.

**Planned AI Features**:
- Gait pattern classification and anomaly detection
- Automated pressure distribution analysis
- Personalized gait recommendations based on historical data
- Machine learning-based pressure threshold alerts

*Note: AI components are in planning stages and not yet integrated into the production system.*

---

## My Contributions

- **Hardware Design**: Selected, integrated, and calibrated FSR and MPU6050 sensors for optimal performance
- **Embedded Firmware**: Developed ESP32 firmware for sensor data acquisition, preprocessing, and wireless transmission
- **System Integration**: Established communication protocols between hardware and software layers
- **Frontend Development**: Built interactive React dashboard with real-time data visualization and gait metrics
- **Testing & Validation**: Conducted preliminary sensor calibration and end-to-end system testing
- **Documentation**: Created technical documentation for reproducibility and future development

---

## Biomedical Applications

- **Clinical Gait Analysis**: Non-invasive assessment of prosthetic user gait patterns
- **Prosthetic Fitting Optimization**: Real-time feedback for clinicians during device adjustment
- **Rehabilitation Monitoring**: Tracking progress during prosthetic training and therapy
- **Pressure Ulcer Prevention**: Detecting high-pressure zones to reduce tissue injury risk
- **Personalized Feedback**: User-facing metrics for gait awareness and improvement
- **Research Platform**: Standardized tool for prosthetics research and biomechanics studies

---

## Future Scope

- **Machine Learning**: Implement gait phase detection and pattern classification algorithms
- **Extended Sensor Coverage**: Integrate additional sensors (temperature, humidity) for comprehensive monitoring
- **Mobile App**: Native iOS/Android application for on-the-go access
- **Data Logging**: Long-term storage and historical analysis capabilities
- **Wireless Protocols**: Support for Bluetooth Low Energy (BLE) for power optimization
- **Clinical Validation**: Comparison studies with gold-standard motion capture systems
- **Wearable Integration**: Connection with smartwatches and fitness trackers for holistic health monitoring

---

## Disclaimer

This project is developed as a biomedical engineering research prototype. Lovable AI was used as a development assistance tool for code generation and UI design but does not represent the core innovation of the system. All hardware integration, sensor calibration, and system architecture decisions are based on original engineering work.

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher) and npm installed ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- Git for version control
- ESP32 development board and required sensors (FSR, MPU6050)

### Installation & Setup

#### Clone the Repository

```sh
git clone https://github.com/Ruben-Samuel-S/stridesense.git
cd stridesense
```

#### Install Dependencies

```sh
npm install
```

#### Start Development Server

```sh
npm run dev
```

The application will launch in your browser with auto-reload enabled.

#### Build for Production

```sh
npm run build
```

#### Deploy

To deploy the dashboard application, follow your preferred hosting platform's documentation (Vercel, Netlify, GitHub Pages, etc.).

### Embedded Firmware Setup

1. Install the [Arduino IDE](https://www.arduino.cc/en/software) or [PlatformIO](https://platformio.org/)
2. Configure ESP32 board and COM port settings
3. Load the firmware code onto the ESP32
4. Configure Wi-Fi credentials in the firmware for network connectivity
5. Verify sensor connections and calibration before deployment

---

## UI Preview

The dashboard provides an intuitive interface for real-time gait monitoring:

- **Live Pressure Heatmap**: Visualizes plantar pressure distribution across the prosthetic foot
- **Motion Graphs**: Real-time plots of acceleration and angular velocity
- **Gait Metrics**: Display of key parameters (stride time, peak pressure, stability indices)
- **Data Export**: Options to download session data for offline analysis
- **Historical Trends**: Comparative analysis across multiple sessions

---

## Contributing

Contributions and feedback are welcome. Please feel free to open issues or submit pull requests.

---

## License

This project is provided as-is for educational and research purposes. Consult relevant regulatory bodies for clinical or commercial applications.

---

## Contact

For questions, suggestions, or collaboration inquiries, please reach out through GitHub issues or contact the project maintainer.

---

**Last Updated**: April 2026
