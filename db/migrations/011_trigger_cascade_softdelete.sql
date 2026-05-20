-- ============================================================
-- 011_trigger_cascade_softdelete.sql
-- Cascade trigger: when employee record_status changes,
-- all their jobhistory rows sync to the same status.
-- ============================================================

CREATE OR REPLACE FUNCTION public.cascade_employee_status()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.record_status IS DISTINCT FROM NEW.record_status THEN
    UPDATE public.jobhistory
    SET
      record_status = NEW.record_status,
      stamp = 'CASCADE-' || NEW.record_status || '-' || NOW()::TEXT
    WHERE empno = NEW.empno;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_cascade_employee_status ON public.employee;

CREATE TRIGGER trg_cascade_employee_status
  AFTER UPDATE ON public.employee
  FOR EACH ROW
  EXECUTE PROCEDURE public.cascade_employee_status();