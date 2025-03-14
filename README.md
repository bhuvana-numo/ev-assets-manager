# Ev-assets-manager

## Players
1. ### EMPS(eMobility Service Provider)
* An eMobility Service Provider (EMSP) provides EV charging services to EV drivers.
* It acts as an intermediary between EV drivers and charging infrastructure, ensuring a smooth and seamless charging experience.
* They focus on customer-facing services, such as providing an EV charging app & web portal for locating and accessing charging stations,handling payments & invoicing for charging sessions,managing driver subscriptions, plans, and pricing,offering customer support,partnering with Charge Point Operators (CPOs) and EV Service Providers (EVSPs) to enable eRoaming, giving EV drivers access to a wide network of chargers.
* Unlike a CPO, an EMSP does not own or operate charging stations but integrates multiple charging networks into its platform using roaming protocols like [OCPI (Open Charge Point Interface)](https://driivz.com/blog/seamless-ev-charging-with-ocpi/) to provide cross-network access.
* As a business, [What do eMobility Service Providers care about?](https://driivz.com/glossary/e-mobility-service-provider/).
  
2. ### CPO(Charging Point Operator)
* CPOs are responsible for selecting, installing, and setting up charging stations at strategic locations, such as parking lots, public areas, businesses, and highway rest stops.
* They also involve in installing hardware from [EVSE]() Vendors.
* CPOs oversee and maintain the entire charging infrastructure network, ensuring chargers are operational and accessible to drivers, offering essential services like user authentication, access control.
* CPOs handle the backend systems to monitor and manage charging stations, user behavior, energy consumption, and performance analytics.
* This software also manages load balancing, energy distribution, dynamic pricing, and optimization for maximum efficiency.
* CPOs use communication protocols (like [OCPP - Open Charge Point Protocol](https://openchargealliance.org/protocols/open-charge-point-protocol/)) to ensure the chargers are connected to the backend system. This allows the chargers to communicate data such as availability, usage, and error status to the operator's network management system.
* CPOs are the operators of the charging network, but they don’t necessarily manufacture the charging stations themselves,the charging stations are the physical infrastructure (often called EVSEs or Electric Vehicle Supply Equipment) that provide the actual charging service.
* #### Few CPO's are:
  1. [ChargePoint](https://www.chargepoint.com/?srsltid=AfmBOoppl-RhnILRkJT4HfOy0t1POYud-O4npzAx8iHC_V9yEtbYKkoG)
  2. [Tesla Supercharger Network](https://www.tesla.com/supercharger)
  3. [Ionity](https://www.ionity.eu/)
  4. [Shell Recharge](https://www.shell.in/motorists/shell-recharge.html)
  5. [EVgo](https://evgo.com/)
* CPO’s Software Vendor refers to the company that provides the backend software or network management system (NMS) used by the Charge Point Operator (CPO) to manage and operate the charging stations.
  #### Few CPO's Software vendors are:
  1. [Driivz](https://driivz.com/)
  2. [Greenlots](https://www.shell.us/electric-vehicle-charging.html#vanity-aHR0cHM6Ly93d3cuc2hlbGwudXMvc2hlbGxyZWNoYXJnZS5odG1s)
  3. [ChargePoint (which also operates as a CPO and software vendor)](https://www.chargepoint.com/?srsltid=AfmBOoqvj2MdA9oOqgLViDCPKJecfATzYjUIFAAsSPgroru7D4QW6wlu)
  4. [Enel X](https://www.mobility.enelx.com/)
 
3. ### Charge Point Owner
* A Charge Point Owner owns the charging stations, which includes the chargers, connectors, and other necessary hardware (such as power meters, cables, and sometimes kiosks).It may also own or lease the land or space where the charging stations are located (e.g., parking lots, shopping centers, highway rest areas).
* It is responsible for the initial investment in purchasing the charging stations and installing them in strategic locations.This could involve significant capital expenditure for purchasing hardware, covering installation costs, and ensuring that the stations have reliable access to electricity.
* If the owner also operates the stations (or has operational control), they might handle the pricing and payment models, but typically this is managed by the CPO(charge point operator),if there is an operator in place.
* The owner ensures that the charging stations meet legal and regulatory standards, including safety, insurance, and other compliance issues related to land use, energy consumption, and environmental factors.
* The owner may collaborate with CPOs or other entities to expand their network but typically doesn’t get involved in the day-to-day operations themselves.
* Businesses or municipalities, may own the charging stations but outsource the operation to a third-party Charge Point Operator (CPO) or another management entity like Charge Point,BP Pulse,Ionity.

## Assets
1. ### Location
* The physical site or geographic area where the EV charging infrastructure is deployed.
* It could be located at various places like parking lots, shopping centers, highways, residential areas, business premises, or public facilities.
* The location determines the availability and accessibility of the charging stations to users, and it might include important considerations like traffic flow, electricity supply, and user convenience.
* Locations should be easy to access, well-marked, and visible to EV drivers. This includes making sure that there is enough space for vehicles to park and charge, with clear signage indicating the charging stations' presence.
* #### In an EV Charging Management System (EV CMS), the location data is typically tracked for multiple purposes:
  1. Mapping : Charging stations are often shown on a map for users to find the nearest available chargers.
  2. Performance Analysis: System operators can track how often stations at particular locations are used, helping them plan for more installations or upgrades.
  3. Maintenance Tracking: The location of charging stations helps maintenance teams identify and prioritize stations that need repair or updates.
* #### Platforms to locate EV charging stations:
  1. [PlugShare](https://www.plugshare.com/)
  2. [EVgo](https://www.evgo.com/)
  3. [Open Charge Map](https://openchargemap.org/site)
 
2. ### Charge Stations
* A charge station typically contains multiple charge points for users to charge their electric vehicles simultaneously. * Each charge station could have different charging capacities, such as Level 1, Level 2, or DC fast charging.
3. ### Charge Points
* A physical charging unit within a charge station where the vehicle actually plugs in to receive power.
* Charge Points have unique identifiers (often called ID numbers) to distinguish them within the management system.
* Charge points often come with smart capabilities, such as communication features to track energy usage, manage charging rates, and communicate with the charging network.
4. ### Connectors
* The physical interface (plug or socket) that connects the charge point to the electric vehicle (EV) for power transfer.
* Different [types of connectors](https://www.power-sonic.com/blog/ev-charging-connector-types/) support different types of charging standards.
 

     
   
  
  
