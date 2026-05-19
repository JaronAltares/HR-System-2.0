# Hope HR System - Entity Relationship Diagram

```mermaid
erDiagram
    %% Core HR Tables
    employee {
        VARCHAR(5) empno PK
        VARCHAR(15) lastname
        VARCHAR(15) firstname
        VARCHAR(10) record_status
    }
    job {
        VARCHAR(4) jobCode PK
        VARCHAR(20) jobDesc
    }
    department {
        VARCHAR(3) deptCode PK
        VARCHAR(20) deptName
    }
    jobHistory {
        VARCHAR(5) empNo PK, FK
        VARCHAR(4) jobCode PK, FK
        DATE effDate PK
        VARCHAR(3) deptCode FK
    }

    employee ||--o{ jobHistory : "has"
    job ||--o{ jobHistory : "assigned in"
    department ||--o{ jobHistory : "located in"

    %% Rights & Auth Tables
    user {
        VARCHAR(50) userId PK
        VARCHAR(20) user_type
        VARCHAR(10) record_status
    }
    Module {
        VARCHAR(20) module_code PK
        VARCHAR(50) module_name
    }
    rights {
        VARCHAR(20) right_code PK
        VARCHAR(20) module_code FK
    }
    user_module {
        VARCHAR(50) userId PK, FK
        VARCHAR(20) module_code PK, FK
    }
    UserModule_Rights {
        VARCHAR(50) userId PK, FK
        VARCHAR(20) module_code PK, FK
        VARCHAR(20) right_code PK, FK
    }

    user ||--o{ user_module : "granted access"
    Module ||--o{ user_module : "contains"
    Module ||--o{ rights : "owns"
    user ||--o{ UserModule_Rights : "assigned"
    rights ||--o{ UserModule_Rights : "includes"