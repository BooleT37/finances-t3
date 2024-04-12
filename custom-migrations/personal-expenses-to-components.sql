-- Run the migration
DO
$$
DECLARE
    parent_expense RECORD;
BEGIN
    FOR parent_expense IN SELECT * FROM "public"."Expense" WHERE "personalExpenseId" IS NOT NULL
    LOOP
        DECLARE
            child_expense RECORD;
        BEGIN
            SELECT * INTO child_expense FROM "public"."Expense" WHERE "id" = parent_expense."personalExpenseId";

            -- Insert a new row into ExpenseComponent before deleting the child expense
            INSERT INTO "public"."ExpenseComponent" ("name", "cost", "categoryId", "subcategoryId", "expenseId")
            VALUES (child_expense."name", child_expense."cost", child_expense."categoryId", child_expense."subcategoryId", parent_expense."id");

            -- Set personalExpenseId of the parent expense to null
            UPDATE "public"."Expense" SET "personalExpenseId" = NULL WHERE "id" = parent_expense."id";

            -- Delete the child expense
            DELETE FROM "public"."Expense" WHERE "id" = child_expense."id";
        END;
    END LOOP;
END;
$$;