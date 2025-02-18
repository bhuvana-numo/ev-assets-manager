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
   
  
  
